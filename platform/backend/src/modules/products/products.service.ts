import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductEntity } from './product.entity';
import { Like, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';
import { SupportService } from 'src/core/support.service';
import { I18nService } from 'nestjs-i18n';
import { ProductResponseDto } from './dto/product-response.dto';
import { CacheService } from '../cache/cache.service';
import { ProductMapper } from './product.mapper';
import { CategoryEntity } from '../categories/category.entity';
import { BrandsEntity } from '../brands/brand.entity';
import { StorageMixin } from 'src/modules/storage/mixin/storage.mixin';

@Injectable()
export class ProductsService extends SupportService {

    private readonly CACHE_KEY = 'products:all';

    constructor(
        @InjectRepository(ProductEntity) private productsRepository: Repository<ProductEntity>,
        @InjectRepository(CategoryEntity) private categoriesRepository: Repository<CategoryEntity>,
        @InjectRepository(BrandsEntity) private brandsRepository: Repository<BrandsEntity>,
        private readonly mapper: ProductMapper,
        private readonly cacheService: CacheService<ProductResponseDto[]>,
        private readonly fileSavingMixin: StorageMixin,
        i18n: I18nService
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
        await this.cacheService.set(this.CACHE_KEY, mappedProducts, { ttl: 60 });
        return mappedProducts;
    }
    
    /**
     * Find products by category.
     * @param {string} idCategory - Category ID.
     * @returns {Promise<ProductResponseDto[]>} - Array of product response DTOs.
     */
    async findByCategory(idCategory: string): Promise<ProductResponseDto[]> {
        const products = await this.productsRepository.find({ where: { idCategory } });
        return this.mapper.mapProductsToResponseDtos(products);
    }

    /**
     * Paginate products.
     * @param {IPaginationOptions} options - Pagination options.
     * @returns {Promise<Pagination<ProductEntity>>} - Paginated products.
     */
    async paginate(options: IPaginationOptions): Promise<Pagination<ProductEntity>> {
        return paginate<ProductEntity>(this.productsRepository, options);
    }

    /**
     * Find products by name.
     * @param {string} name - Product name.
     * @returns {Promise<ProductResponseDto[]>} - Array of product response DTOs.
     */
    async findByName(name: string): Promise<ProductResponseDto[]> {
        const products = await this.productsRepository.find({ where: { name: Like(`%${name}%`) } });
        return this.mapper.mapProductsToResponseDtos(products);
    }
    
    /**
     * Create a new product.
     * @param {CreateProductDto} createProductDto - Product data.
     * @returns {Promise<ProductResponseDto>} - Created product response DTO.
     */
    async create(createProductDto: CreateProductDto): Promise<ProductResponseDto> {
        const categoryFound = await this.findCategory(createProductDto.idCategory);
        const brandFound = await this.findBrand(createProductDto.idBrand);
        createProductDto.mainImage = await this.fileSavingMixin.saveImageFile(createProductDto.mainImageFile);
        createProductDto.secondaryImage = await this.fileSavingMixin.saveImageFile(createProductDto.secondaryImageFile);
        const newProduct = this.mapper.mapCreateProductDtoToEntity(createProductDto);
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
    async update(id: string, updateProductDto: UpdateProductDto): Promise<ProductResponseDto> {
      const productFound = await this.findProduct(id);
      const categoryFound = await this.findCategory(updateProductDto.idCategory);
      const brandFound = await this.findBrand(updateProductDto.idBrand);
      updateProductDto.mainImage = await this.fileSavingMixin.saveImageFile(updateProductDto.mainImageFile, productFound.mainImage);
      updateProductDto.secondaryImage = await this.fileSavingMixin.saveImageFile(updateProductDto.secondaryImageFile, productFound.secondaryImage);
      const productToUpdate = this.mapper.mapUpdateProductDtoToEntity(updateProductDto, productFound);
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
        return this.resolveString("PRODUCT_DELETED_SUCCESSFULLY");
    }
    
    private async findProduct(id: string): Promise<ProductEntity> {
        const productFound = await this.productsRepository.findOne({ where: { id }})
        if (!productFound) {
          this.throwNotFoundException('PRODUCT_NOT_FOUND');
        }
        return productFound;
    }

    private async findCategory(id: string): Promise<CategoryEntity> {
      const categoryFound = await this.categoriesRepository.findOne({ where: { id }})
      if (!categoryFound) {
        this.throwNotFoundException('CATEGORY_NOT_FOUND');
      }
      return categoryFound;
    }

    private async findBrand(id: string): Promise<BrandsEntity> {
      const brandFound = await this.brandsRepository.findOne({ where: { id }})
      if (!brandFound) {
        this.throwNotFoundException('BRAND_NOT_FOUND');
      }
      return brandFound;
    }
}
