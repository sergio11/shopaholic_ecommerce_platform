import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductEntity } from './product.entity';
import { Like, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { Pagination, paginate } from 'nestjs-typeorm-paginate';
import { SupportService } from 'src/core/support.service';
import { I18nService } from 'nestjs-i18n';
import { ProductResponseDto } from './dto/product-response.dto';
import { CacheService } from '../cache/cache.service';
import { ProductMapper } from './product.mapper';
import { CategoryEntity } from '../categories/category.entity';
import { BrandsEntity } from '../brands/brand.entity';
import { StorageMixin } from 'src/modules/storage/mixin/file-saving.mixin';
import { UserEntity } from '../users/user.entity';

@Injectable()
export class ProductsService extends SupportService {
  private readonly CACHE_KEY = 'cache:products:all';
  private readonly DEFAULT_TTL_IN_SECONDS = 60;

  constructor(
    @InjectRepository(ProductEntity)
    private productsRepository: Repository<ProductEntity>,
    @InjectRepository(CategoryEntity)
    private categoriesRepository: Repository<CategoryEntity>,
    @InjectRepository(BrandsEntity)
    private brandsRepository: Repository<BrandsEntity>,
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private readonly mapper: ProductMapper,
    private readonly cacheService: CacheService<ProductResponseDto[]>,
    private readonly fileSavingMixin: StorageMixin,
    i18n: I18nService,
  ) {
    super(i18n);
  }

  /**
   * Get all products.
   * @returns {Promise<ProductResponseDto[]>} - Array of product response DTOs.
   */
  async findAll(): Promise<ProductResponseDto[]> {
    const cachedProducts = await this.cacheService.get(this.CACHE_KEY);
    if (cachedProducts) {
      return cachedProducts;
    }
    const products = await this.productsRepository.find();
    const mappedProducts = this.mapper.mapProductsToResponseDtos(products);
    await this.cacheService.set(
      this.CACHE_KEY,
      mappedProducts,
      this.DEFAULT_TTL_IN_SECONDS,
    );
    return mappedProducts;
  }

  /**
   * Find products by category.
   * @param {string} idCategory - Category ID.
   * @returns {Promise<ProductResponseDto[]>} - Array of product response DTOs.
   */
  async findByCategory(idCategory: string): Promise<ProductResponseDto[]> {
    const products = await this.productsRepository.find({
      where: { idCategory },
    });
    return this.mapper.mapProductsToResponseDtos(products);
  }

  /**
   * Search for products based on a search term and paginate the results.
   *
   * @param {string} term - The search term to filter products by.
   * @param {number} page - The page number for pagination (default is 1).
   * @param {number} limit - The number of items per page (default is 10).
   * @returns {Promise<Pagination<ProductResponseDto>>} - A paginated result of category response DTOs.
   */
  async searchAndPaginate(
    term: string,
    page: number,
    limit: number,
  ): Promise<Pagination<ProductResponseDto>> {
    if (page < 1) {
      this.throwBadRequestException('PAGE_NUMBER_NOT_VALID');
    }

    if (limit < 1 || limit > 100) {
      this.throwBadRequestException('LIMIT_NUMBER_NOT_VALID');
    }

    const options = { page, limit };
    let queryBuilder = this.productsRepository.createQueryBuilder('product');
    if (term) {
      queryBuilder = queryBuilder.where(
        'LOWER(product.name) LIKE LOWER(:term)',
        { term: `%${term}%` },
      );
    }
    queryBuilder = queryBuilder.orderBy('product.name');
    const paginatedProducts = await paginate(queryBuilder, options);
    const items = paginatedProducts.items.map((product) =>
      this.mapper.mapProductToResponseDto(product),
    );

    return {
      ...paginatedProducts,
      items,
    };
  }

  /**
   * Find products by name.
   * @param {string} name - Product name.
   * @returns {Promise<ProductResponseDto[]>} - Array of product response DTOs.
   */
  async findByName(name: string): Promise<ProductResponseDto[]> {
    const products = await this.productsRepository.find({
      where: { name: Like(`%${name}%`) },
    });
    return this.mapper.mapProductsToResponseDtos(products);
  }

  /**
   * Create a new product.
   * @param {CreateProductDto} createProductDto - Product data.
   * @returns {Promise<ProductResponseDto>} - Created product response DTO.
   */
  async create(
    createProductDto: CreateProductDto,
  ): Promise<ProductResponseDto> {
    const categoryFound = await this.findCategory(createProductDto.idCategory);
    const brandFound = await this.findBrand(createProductDto.idBrand);
    createProductDto.mainImage = await this.fileSavingMixin.saveImageFile(
      createProductDto.mainImageFile,
    );
    createProductDto.secondaryImage = await this.fileSavingMixin.saveImageFile(
      createProductDto.secondaryImageFile,
    );
    const newProduct =
      this.mapper.mapCreateProductDtoToEntity(createProductDto);
    newProduct.category = categoryFound;
    newProduct.brand = brandFound;
    const savedProduct = await this.productsRepository.save(newProduct);
    return this.mapper.mapProductToResponseDto(savedProduct);
  }

  /**
   * Update a product.
   * @param {string} id - Product ID.
   * @param {UpdateProductDto} updateProductDto - Updated product data.
   * @returns {Promise<ProductResponseDto>} - Updated product response DTO.
   */
  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    const productFound = await this.findProduct(id);
    const categoryFound = await this.findCategory(updateProductDto.idCategory);
    const brandFound = await this.findBrand(updateProductDto.idBrand);
    updateProductDto.mainImage = await this.fileSavingMixin.saveImageFile(
      updateProductDto.mainImageFile,
      productFound.mainImage,
    );
    updateProductDto.secondaryImage = await this.fileSavingMixin.saveImageFile(
      updateProductDto.secondaryImageFile,
      productFound.secondaryImage,
    );
    const productToUpdate = this.mapper.mapUpdateProductDtoToEntity(
      updateProductDto,
      productFound,
    );
    productToUpdate.category = categoryFound;
    productToUpdate.brand = brandFound;
    const productUpdated = await this.productsRepository.save(productToUpdate);
    return this.mapper.mapProductToResponseDto(productUpdated);
  }

  /**
   * Delete a product.
   * @param {string} id - Product ID.
   * @returns {Promise<string>}
   */
  async delete(id: string): Promise<string> {
    const product = await this.findProduct(id);
    await this.fileSavingMixin.removeImageFile(product.mainImage);
    await this.fileSavingMixin.removeImageFile(product.secondaryImage);
    await this.productsRepository.delete(id);
    return this.resolveString('PRODUCT_DELETED_SUCCESSFULLY');
  }

  /**
   * Toggles the "like" reaction on a product for a user.
   * @param {string} idProduct - The ID of the product.
   * @param {string} idUser - The ID of the user reacting.
   * @returns {Promise<string>}  Successfully message
   */
  async like(idProduct: string, idUser: string): Promise<string> {
    await this.toggleReaction(idProduct, idUser, 'likes');
    return this.resolveString('LIKE_PRODUCT_SUCCESSFULLY');
  }

  /**
   * Toggles the "dislike" reaction on a product for a user.
   * @param {string} idProduct - The ID of the product.
   * @param {string} idUser - The ID of the user reacting.
   * @returns {Promise<string>} Successfully message
   */
  async dislike(idProduct: string, idUser: string): Promise<string> {
    this.toggleReaction(idProduct, idUser, 'dislikes');
    return this.resolveString('DISLIKE_PRODUCT_SUCCESSFULLY');
  }

  /**
   * Toggles a reaction (like or dislike) on a product for a user.
   * @param {string} idProduct - The ID of the product.
   * @param {string} idUser - The ID of the user reacting.
   * @param {'likes' | 'dislikes'} reactionField - The reaction field to toggle.
   * @returns {Promise<ProductEntity>} The updated product entity.
   * @throws {NotFoundException} If the product is not found or if the user is not found.
   */
  private async toggleReaction(
    idProduct: string,
    idUser: string,
    reactionField: 'likes' | 'dislikes',
  ): Promise<ProductEntity> {
    const review = await this.findProduct(idProduct, [reactionField]);
    const otherReactionField = reactionField === 'likes' ? 'dislikes' : 'likes';

    // Encuentra el usuario por su id
    const user = await this.usersRepository.findOne({ where: { id: idUser } });
    if (!user) {
      throw this.throwNotFoundException('USER_NOT_FOUND');
    }

    const allProducts = await this.productsRepository.find();
    const updatedProducts: ProductEntity[] = [];
    let targetProduct: ProductEntity | undefined;

    for (const r of allProducts) {
      if (r.id === idProduct) {
        targetProduct = r;
        if (
          r[reactionField].some((reactionUser) => reactionUser.id === idUser)
        ) {
          // User has already reacted, remove the reaction
          r[reactionField] = r[reactionField].filter(
            (reactionUser) => reactionUser.id !== idUser,
          );
        } else {
          // User has not reacted, add the reaction
          r[reactionField].push(user);
          // Remove other reaction if the user has reacted before
          r[otherReactionField] = r[otherReactionField].filter(
            (otherReactionUser) => otherReactionUser.id !== idUser,
          );
        }
      }

      // Recalculate isBestRated and isWorstRated for other reviews
      const likesCount = r.likes.length;
      const dislikesCount = r.dislikes.length;
      r.isBestRated = likesCount >= dislikesCount;
      r.isWorstRated = dislikesCount > likesCount;

      updatedProducts.push(r);
    }

    if (targetProduct) {
      targetProduct.isBestRated =
        targetProduct.likes.length >= targetProduct.dislikes.length;
      targetProduct.isWorstRated =
        targetProduct.dislikes.length > targetProduct.likes.length;
      updatedProducts.push(targetProduct);
    }

    await this.productsRepository.save(updatedProducts);
    return review;
  }

  private async findProduct(
    id: string,
    relations?: string[],
  ): Promise<ProductEntity> {
    return await this.findEntityById(
      id,
      this.productsRepository,
      'PRODUCT_NOT_FOUND',
      relations,
    );
  }

  private async findCategory(id: string): Promise<CategoryEntity> {
    return await this.findEntityById(
      id,
      this.categoriesRepository,
      'CATEGORY_NOT_FOUND',
    );
  }

  private async findBrand(id: string): Promise<BrandsEntity> {
    return await this.findEntityById(
      id,
      this.brandsRepository,
      'BRAND_NOT_FOUND',
    );
  }
}
