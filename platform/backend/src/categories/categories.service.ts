import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import CreateCategoryDTO from './dto/create-category.dto';
import storage = require('../utils/cloud_storage');
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { Repository } from 'typeorm';
import UpdateCategoryDTO from './dto/update-category.dto';
import { SupportService } from 'src/core/support.service';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class CategoriesService extends SupportService {

    constructor(
        @InjectRepository(Category) private categoriesRepository: Repository<Category>,
        i18n: I18nService
    ) {
        super(i18n);
    }

    findAll() {
        return this.categoriesRepository.find()    
    }

    async create(file: Express.Multer.File, category: CreateCategoryDTO) {
        const url = await storage(file, file.originalname);
        
        if (url === undefined && url === null) {
            throw new HttpException(this.resolveString("IMAGE_ERROR"), HttpStatus.INTERNAL_SERVER_ERROR);
        }

        category.image = url;
        const newCategory = this.categoriesRepository.create(category)
        return this.categoriesRepository.save(newCategory);
    }
    

    async update(id: number, category: UpdateCategoryDTO) {        
        const categoryFound = await this.categoriesRepository.findOneBy({ id: id });
        
        if (!categoryFound) {
            throw new HttpException(this.resolveString("CATEGORY_NOT_FOUND"), HttpStatus.NOT_FOUND);
        }

        const updatedCategory = Object.assign(categoryFound, category);
        return this.categoriesRepository.save(updatedCategory);
    }
   
    async updateWithImage(file: Express.Multer.File, id: number, category: UpdateCategoryDTO) {
        const url = await storage(file, file.originalname);
        
        if (url === undefined && url === null) {
            throw new HttpException(this.resolveString("IMAGE_ERROR"), HttpStatus.INTERNAL_SERVER_ERROR);
        }
        
        const categoryFound = await this.categoriesRepository.findOneBy({ id: id });
        
        if (!categoryFound) {
            throw new HttpException(this.resolveString("CATEGORY_NOT_FOUND"), HttpStatus.NOT_FOUND);
        }

        category.image = url;
        const updatedCategory = Object.assign(categoryFound, category);
        return this.categoriesRepository.save(updatedCategory);
    }

    async delete(id: number) {
        const categoryFound = await this.categoriesRepository.findOneBy({ id: id });
        
        if (!categoryFound) {
            throw new HttpException(this.resolveString("CATEGORY_NOT_FOUND"), HttpStatus.NOT_FOUND);
        }
        
        return this.categoriesRepository.delete(id);
    }

}
