import { Inject, Injectable } from '@nestjs/common';
import CreateCategoryDTO from './dto/create-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './category.entity';
import { Repository } from 'typeorm';
import UpdateCategoryDTO from './dto/update-category.dto';
import { SupportService } from 'src/core/support.service';
import { I18nService } from 'nestjs-i18n';
import { IStorageService, STORAGE_SERVICE } from '../storage/storage.service';

@Injectable()
export class CategoriesService extends SupportService {

    constructor(
        @InjectRepository(CategoryEntity) private categoriesRepository: Repository<CategoryEntity>,
        @Inject(STORAGE_SERVICE)
        private readonly storageService: IStorageService,
        i18n: I18nService
    ) {
        super(i18n);
    }

    async findAll() {
        return this.categoriesRepository.find(); 
    }

    async create(file: Express.Multer.File, category: CreateCategoryDTO) {
        const url = await this.storageService.saveFile(file.buffer, file.originalname, file.mimetype);
        if (url === undefined && url === null) {
            this.throwInternalServerError("IMAGE_ERROR");
        }
        category.image = url;
        console.log(`category.image url -> ${url}`)
        const newCategory = this.categoriesRepository.create(category)
        return this.categoriesRepository.save(newCategory);
    }
    

    async update(id: string, category: UpdateCategoryDTO) {    
        const categoryFound = await this.findCategory(id);
        const updatedCategory = Object.assign(categoryFound, category);
        return this.categoriesRepository.save(updatedCategory);
    }
   
    async updateWithImage(file: Express.Multer.File, id: string, category: UpdateCategoryDTO) {
        const url = await this.storageService.saveFile(file.buffer, file.originalname, file.mimetype);
        if (url === undefined && url === null) {
            this.throwInternalServerError("IMAGE_ERROR");
        }
        const categoryFound = await this.findCategory(id);
        category.image = url;
        const updatedCategory = Object.assign(categoryFound, category);
        return this.categoriesRepository.save(updatedCategory);
    }

    async delete(id: string) {
        await this.findCategory(id);
        return this.categoriesRepository.delete(id);
    }

    private async findCategory(id: string) {
        const categoryFound = await this.categoriesRepository.findOneBy({ id: id });
        if (!categoryFound) {
            this.throwNotFoundException("CATEGORY_NOT_FOUND");
        }
        return categoryFound;
    }

}
