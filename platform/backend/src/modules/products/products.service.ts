import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductEntity } from './product.entity';
import { Like, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';
import { SupportService } from 'src/core/support.service';
import { I18nService } from 'nestjs-i18n';
import { IStorageService, STORAGE_SERVICE } from '../storage/storage.service';
import { ProductResponseDto } from './dto/product-response.dto';
import { CacheService } from '../cache/cache.service';
import { ProductMapper } from './product.mapper';

@Injectable()
export class ProductsService extends SupportService {

    private readonly CACHE_KEY = 'products:all';

    constructor(
        @InjectRepository(ProductEntity) private productsRepository: Repository<ProductEntity>,
        @Inject(STORAGE_SERVICE)
        storageService: IStorageService,
        private readonly mapper: ProductMapper,
        private readonly cacheService: CacheService<ProductResponseDto[]>,
        i18n: I18nService
    ) {
        super(i18n, storageService);
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
     * @param {Array<Express.Multer.File>} files - Array of image files.
     * @param {CreateProductDto} product - Product data.
     * @returns {Promise<ProductResponseDto>} - Created product response DTO.
     */
    async create(files: Array<Express.Multer.File>, product: CreateProductDto): Promise<ProductResponseDto> {
        if (files.length === 0) {
            this.throwBadRequestException('NO_IMAGES_PROVIDED');
        }
        await this.asyncForEach(files, async (file: Express.Multer.File, index: number) => {
          const response = await this.saveFileAndGetImageDto(file);
          if (index === 0) {
            product.mainImage = response;
          } else if (index === 1) {
            product.secondaryImage = response;
          }
        });
        const newProduct = this.mapper.mapCreateProductDtoToEntity(product);
        const savedProduct = await this.productsRepository.save(newProduct);
        return this.mapper.mapProductToResponseDto(savedProduct);
    }

    /**
     * Update a product.
     * @param {string} id - Product ID.
     * @param {UpdateProductDto} product - Updated product data.
     * @param {Array<Express.Multer.File>} files - Array of image files.
     * @returns {Promise<ProductResponseDto>} - Updated product response DTO.
     */
    async update(id: string, product: UpdateProductDto, files: Array<Express.Multer.File>): Promise<ProductResponseDto> {
      const productFound = await this.findProduct(id);
      await this.asyncForEach(files, async (file: Express.Multer.File, index: number) => {
        const response = await this.saveFileAndGetImageDto(file);
        if(response) {
          if (index === 0) {
            product.mainImage = response;
          } else if (index === 1) {
            product.secondaryImage = response;
          }
        }
      });
      const productToUpdate = this.mapper.mapUpdateProductDtoToEntity(product, productFound);
      const productUpdated = await this.productsRepository.save(productToUpdate);
      return this.mapper.mapProductToResponseDto(productUpdated);
    }
    
    /**
     * Delete a product.
     * @param {string} id - Product ID.
     * @returns {Promise<void>}
     */
    async delete(id: string): Promise<void> {
        await this.findProduct(id);
        await this.productsRepository.delete(id);
    }
    
    private async findProduct(id: string): Promise<ProductEntity> {
        const productFound = await this.productsRepository.findOne({ where: { id }})
        if (!productFound) {
          this.throwNotFoundException('PRODUCT_NOT_FOUND');
        }
        return productFound;
    }
}
