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
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { ProductResponseDto } from './dto/product-response.dto';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class ProductsService extends SupportService {

    private readonly CACHE_KEY = 'products:all';

    constructor(
        @InjectRepository(ProductEntity) private productsRepository: Repository<ProductEntity>,
        @Inject(STORAGE_SERVICE)
        private readonly storageService: IStorageService,
        @InjectMapper()
        private readonly mapper: Mapper,
        private readonly cacheService: CacheService<ProductResponseDto[]>,
        i18n: I18nService
    ) {
        super(i18n);
    }

    async findAll(): Promise<ProductResponseDto[]> {
        const cachedProducts = await this.cacheService.get(this.CACHE_KEY);
        if (cachedProducts) {
            return cachedProducts;
        }
        const products = await this.productsRepository.find();
        const mappedProducts = this.mapper.mapArray(products, ProductEntity, ProductResponseDto);
        await this.cacheService.set(this.CACHE_KEY, mappedProducts, { ttl: 60 });
        return mappedProducts;
    }
    
    async findByCategory(idCategory: string): Promise<ProductResponseDto[]> {
        const products = await this.productsRepository.find({ where: { idCategory } });
        return this.mapper.mapArray(products, ProductEntity, ProductResponseDto);
    }

    async paginate(options: IPaginationOptions): Promise<Pagination<ProductEntity>> {
        return paginate<ProductEntity>(this.productsRepository, options);
    }

    async findByName(name: string): Promise<ProductResponseDto[]> {
        const products = await this.productsRepository.find({ where: { name: Like(`%${name}%`) } });
        return this.mapper.mapArray(products, ProductEntity, ProductResponseDto);
    }
    
    async create(files: Array<Express.Multer.File>, product: CreateProductDto): Promise<ProductResponseDto> {
        if (files.length === 0) {
            this.throwBadRequestException('NO_IMAGES_PROVIDED');
        }
        const newProduct = this.productsRepository.create(product);
        const savedProduct = await this.productsRepository.save(newProduct);
        await this.asyncForEach(files, async (file: Express.Multer.File, index: number) => {
            const url = await this.storageService.saveFile(file.buffer, file.mimetype);
            if (url !== undefined && url !== null) {
              if (index === 0) {
                savedProduct.image1 = url;
              } else if (index === 1) {
                savedProduct.image2 = url;
              }
            }
        });
        const savedProductToReturn = await this.productsRepository.save(savedProduct);
        return this.mapper.map(savedProductToReturn, ProductEntity, ProductResponseDto);
    }
    
    async updateWithImages(files: Array<Express.Multer.File>, id: string, product: UpdateProductDto):Promise<ProductResponseDto> {
        if (files.length === 0) {
          this.throwBadRequestException('NO_IMAGES_PROVIDED');
        }
    
        const updatedProduct = await this.updateAnyProduct(id, product);
    
        await this.asyncForEach(files, async (file: Express.Multer.File, index: number) => {
          const url = await this.storageService.saveFile(file.buffer, file.mimetype);
          if (url !== undefined && url !== null) {
            if (index === 0) {
              updatedProduct.image1 = url;
            } else if (index === 1) {
              updatedProduct.image2 = url;
            }
          }
        });
    
        const updatedProductToReturn = await this.productsRepository.save(updatedProduct);
        return this.mapper.map(updatedProductToReturn, ProductEntity, ProductResponseDto);
    }

    async update(id: string, product: UpdateProductDto): Promise<ProductResponseDto> {
        const updatedProduct = await this.updateAnyProduct(id, product);
        return this.mapper.map<ProductEntity, ProductResponseDto>(updatedProduct, ProductEntity, ProductResponseDto);
    }
    
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

    private async updateAnyProduct(id: string, product: UpdateProductDto): Promise<ProductEntity> {
        const productFound = await this.findProduct(id);
        Object.assign(productFound, product);
        console.log('Product Updated:', productFound);
        return this.productsRepository.save(productFound);
    }
}
