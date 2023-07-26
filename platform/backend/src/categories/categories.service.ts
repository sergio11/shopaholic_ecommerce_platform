import { Injectable } from '@nestjs/common';
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
            this.throwInternalServerError("IMAGE_ERROR");
        }
        category.image = url;
        const newCategory = this.categoriesRepository.create(category)
        return this.categoriesRepository.save(newCategory);
    }
    

    async update(id: number, category: UpdateCategoryDTO) {    
        const categoryFound = await this.findCategory(id);
        const updatedCategory = Object.assign(categoryFound, category);
        return this.categoriesRepository.save(updatedCategory);
    }
   
    async updateWithImage(file: Express.Multer.File, id: number, category: UpdateCategoryDTO) {
        const url = await storage(file, file.originalname);
        if (url === undefined && url === null) {
            this.throwInternalServerError("IMAGE_ERROR");
        }
        const categoryFound = await this.findCategory(id);
        category.image = url;
        const updatedCategory = Object.assign(categoryFound, category);
        return this.categoriesRepository.save(updatedCategory);
    }

    async delete(id: number) {
        await this.findCategory(id);
        return this.categoriesRepository.delete(id);
    }

    private async findCategory(id: number) {
        const categoryFound = await this.categoriesRepository.findOneBy({ id: id });
        if (!categoryFound) {
            this.throwNotFoundException("CATEGORY_NOT_FOUND");
        }
        return categoryFound;
    }

}
