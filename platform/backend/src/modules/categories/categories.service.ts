import { Inject, Injectable } from '@nestjs/common';
import CreateCategoryDTO from './dto/create-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './category.entity';
import { Repository } from 'typeorm';
import UpdateCategoryDTO from './dto/update-category.dto';
import { SupportService } from 'src/core/support.service';
import { I18nService } from 'nestjs-i18n';
import { IStorageService, STORAGE_SERVICE } from '../storage/storage.service';
import { CategoryResponseDto } from './dto/category-response.dto';
import { CacheService } from '../cache/cache.service';
import { CategoryMapper } from './category.mapper';

@Injectable()
export class CategoriesService extends SupportService {

    private readonly CACHE_KEY = 'all-categories';

    /**
     * Constructor of the CategoriesService class.
     * @param categoriesRepository The repository for CategoryEntity.
     * @param storageService The storage service to handle file uploads.
     * @param cacheService The cache service to store category data.
     * @param i18n The internationalization service.
     * @param categoryMapper The mapper for category data.
     */
    constructor(
        @InjectRepository(CategoryEntity) private categoriesRepository: Repository<CategoryEntity>,
        @Inject(STORAGE_SERVICE)
        storageService: IStorageService,
        private readonly cacheService: CacheService<CategoryResponseDto[]>,
        i18n: I18nService,
        private readonly categoryMapper: CategoryMapper,
    ) {
        super(i18n, storageService);
    }

    /**
     * Retrieve all categories.
     * @returns A list of category response DTOs.
     */
    async findAll(): Promise<CategoryResponseDto[]> {
        const cachedCategories = await this.cacheService.get(this.CACHE_KEY);
        if (cachedCategories) {
            return cachedCategories;
        }
        const categories = await this.categoriesRepository.find();
        const categoryDtos = this.categoryMapper.mapCategoriesToResponseDtos(categories);
        await this.cacheService.set(this.CACHE_KEY, categoryDtos, { ttl: 60 });
        return categoryDtos;
    }

    /**
     * Create a new category.
     * @param createCategoryDto The data for creating the category.
     * @returns The created category response DTO.
     */
    async create(createCategoryDto: CreateCategoryDTO): Promise<CategoryResponseDto> {
        createCategoryDto.image = await this.saveFileAndGetImageDto(createCategoryDto.imageFile);
        const newCategory = this.categoryMapper.mapCreateCategoryDtoToEntity(createCategoryDto);
        const savedCategory = await this.categoriesRepository.save(newCategory);
        await this.invalidateCache();
        return this.categoryMapper.mapCategoryToResponseDto(savedCategory);
    }

    /**
     * Update an existing category.
     * @param id The ID of the category to be updated.
     * @param updateCategoryDto The updated category data.
     * @returns The updated category response DTO.
     */
    async update(id: string, updateCategoryDto: UpdateCategoryDTO): Promise<CategoryResponseDto> {    
        const categoryFound = await this.findCategory(id);     
        updateCategoryDto.image = await this.saveFileAndGetImageDto(updateCategoryDto.imageFile);
        const updatedCategory = this.categoryMapper.mapUpdateCategoryDtoToEntity(updateCategoryDto, categoryFound);
        const savedCategory = await this.categoriesRepository.save(updatedCategory);
        await this.invalidateCache();
        return this.categoryMapper.mapCategoryToResponseDto(savedCategory);
    }

    /**
     * Delete a category by its ID.
     * @param id The ID of the category to be deleted.
     */
    async delete(id: string) {
        await this.findCategory(id);
        await this.invalidateCache();
        return this.categoriesRepository.delete(id);
    }

    /**
     * Find a category by its ID.
     * @param id The ID of the category to be found.
     * @returns The found category entity.
     * @throws NotFoundException if the category is not found.
     */
    private async findCategory(id: string) {
        const categoryFound = await this.categoriesRepository.findOneBy({ id: id });
        if (!categoryFound) {
            this.throwNotFoundException("CATEGORY_NOT_FOUND");
        }
        return categoryFound;
    }

    /**
     * Invalidate the cache storing category data.
     * @private
     */
    private async invalidateCache() {
        await this.cacheService.delete(this.CACHE_KEY);
    }
}