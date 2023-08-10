import { Inject, Injectable } from '@nestjs/common';
import CreateCategoryDTO from './dto/create-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './category.entity';
import { Repository } from 'typeorm';
import UpdateCategoryDTO from './dto/update-category.dto';
import { SupportService } from 'src/core/support.service';
import { I18nService } from 'nestjs-i18n';
import { IStorageService, STORAGE_SERVICE } from '../storage/storage.service';
import { Mapper } from '@automapper/core';
import { CategoryResponseDto } from './dto/category-response.dto';
import { InjectMapper } from '@automapper/nestjs';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class CategoriesService extends SupportService {

    private readonly CACHE_KEY = 'all-categories';

    constructor(
        @InjectRepository(CategoryEntity) private categoriesRepository: Repository<CategoryEntity>,
        @Inject(STORAGE_SERVICE)
        private readonly storageService: IStorageService,
        private readonly cacheService: CacheService<CategoryResponseDto[]>,
        i18n: I18nService,
        @InjectMapper()
        private readonly mapper: Mapper,
    ) {
        super(i18n);
    }

    async findAll(): Promise<CategoryResponseDto[]> {
        const cachedCategories = await this.cacheService.get(this.CACHE_KEY);
        if (cachedCategories) {
            return cachedCategories;
        }
        const categories = await this.categoriesRepository.find();
        const categoryDtos = this.mapper.mapArray(categories, CategoryEntity, CategoryResponseDto);
        await this.cacheService.set(this.CACHE_KEY, categoryDtos, { ttl: 60 });
        return categoryDtos;
    }

    async create(file: Express.Multer.File, category: CreateCategoryDTO): Promise<CategoryResponseDto> {
        const url = await this.storageService.saveFile(file.buffer, file.originalname, file.mimetype);
        if (url === undefined && url === null) {
            this.throwInternalServerError("IMAGE_ERROR");
        }
        category.image = url;
        console.log(`category.image url -> ${url}`)
        const newCategory = this.categoriesRepository.create(category)
        const savedCategory = await this.categoriesRepository.save(newCategory);
        await this.invalidateCache();
        return this.mapper.map(savedCategory, CategoryResponseDto);
    }
    

    async update(id: string, category: UpdateCategoryDTO): Promise<CategoryResponseDto> {    
        const categoryFound = await this.findCategory(id);
        const updatedCategory = Object.assign(categoryFound, category);
        const savedCategory = await this.categoriesRepository.save(updatedCategory);
        await this.invalidateCache();
        return this.mapper.map(savedCategory, CategoryResponseDto);
    }
   
    async updateWithImage(file: Express.Multer.File, id: string, category: UpdateCategoryDTO): Promise<CategoryResponseDto> {
        const url = await this.storageService.saveFile(file.buffer, file.originalname, file.mimetype);
        if (url === undefined && url === null) {
            this.throwInternalServerError("IMAGE_ERROR");
        }
        const categoryFound = await this.findCategory(id);
        category.image = url;
        const updatedCategory = Object.assign(categoryFound, category);
        const savedCategory = await this.categoriesRepository.save(updatedCategory);
        await this.invalidateCache();
        return this.mapper.map(savedCategory, CategoryResponseDto);
    }

    async delete(id: string) {
        await this.findCategory(id);
        await this.invalidateCache();
        return this.categoriesRepository.delete(id);
    }

    private async findCategory(id: string) {
        const categoryFound = await this.categoriesRepository.findOneBy({ id: id });
        if (!categoryFound) {
            this.throwNotFoundException("CATEGORY_NOT_FOUND");
        }
        return categoryFound;
    }

    private async invalidateCache() {
        await this.cacheService.delete(this.CACHE_KEY);
    }

}

