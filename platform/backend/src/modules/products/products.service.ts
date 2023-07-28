import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductEntity } from './product.entity';
import { Like, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';
import asyncForEach = require('../../core/utils/async_foreach');
import storage = require('../../core/utils/cloud_storage');
import { SupportService } from 'src/core/support.service';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class ProductsService extends SupportService {

    constructor(
        @InjectRepository(ProductEntity) private productsRepository: Repository<ProductEntity>,
        i18n: I18nService
    ) {
        super(i18n);
    }

    findAll() {
        return this.productsRepository.find();
    }
    
    findByCategory(idCategory: number) {
        return this.productsRepository.findBy({ idCategory: idCategory });
    }

    async paginate(options: IPaginationOptions): Promise<Pagination<ProductEntity>> {
        return paginate<ProductEntity>(this.productsRepository, options);
    }

    findByName(name: string) {
        return this.productsRepository.find({ where : { name: Like(`%${name}%`) }})
    }

    async create(files: Array<Express.Multer.File>, product: CreateProductDto) {

        if (files.length === 0) {
            this.throwBadRequestException("NO_IMAGES_PROVIDED");
        }
        let uploadedFiles = 0;
        const newProduct = await this.productsRepository.create(product);
        const savedProduct = await this.productsRepository.save(newProduct);        
        const startForEach = async () => {
            await asyncForEach(files, async (file: Express.Multer.File) => {
                const url = await storage(file, file.originalname);

                if (url !== undefined && url !== null) {
                    if (uploadedFiles === 0) {
                        savedProduct.image1 = url
                    }
                    else if (uploadedFiles === 1) {
                        savedProduct.image2 = url
                    }
                }

                await this.update(savedProduct.id, savedProduct);
                uploadedFiles = uploadedFiles + 1;
                
            })
        }
        await startForEach();
        return savedProduct;
        
    }
    
    async updateWithImages(files: Array<Express.Multer.File>, id: number, product: UpdateProductDto) {

        if (files.length === 0) {
            this.throwBadRequestException("NO_IMAGES_PROVIDED");
        }

        let counter = 0;
        let uploadedFiles = Number(product.images_to_update[counter]);

        const updatedProduct = await this.update(id, product);     

        const startForEach = async () => {
            await asyncForEach(files, async (file: Express.Multer.File) => {
                const url = await storage(file, file.originalname);

                if (url !== undefined && url !== null) {
                    if (uploadedFiles === 0) {
                        updatedProduct.image1 = url
                    }
                    else if (uploadedFiles === 1) {
                        updatedProduct.image2 = url
                    }
                }

                await this.update(updatedProduct.id, updatedProduct);
                counter++;
                uploadedFiles = Number(product.images_to_update[counter]);
                
            })
        }
        await startForEach();
        return updatedProduct;
        
    }

    async update(id: number, product: UpdateProductDto)  {   
        const productFound = await this.findProduct(id);
        const updatedProduct = Object.assign(productFound, product);
        console.log('Product Updated:', updatedProduct);
        return this.productsRepository.save(updatedProduct);
    }
    
    async delete(id: number)  {
        await this.findProduct(id);
        return this.productsRepository.delete(id);
    }

    private async findProduct(id: number) {
        const productFound = await this.productsRepository.findOneBy({ id: id });
        if (!productFound) {
            this.throwNotFoundException("PRODUCT_NOT_FOUND");
        }
        return productFound;
    }


}
