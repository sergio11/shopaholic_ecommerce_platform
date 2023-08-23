import { Injectable } from '@nestjs/common';
import CreateCategoryDTO from './dto/create-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './category.entity';
import { Repository } from 'typeorm';
import UpdateCategoryDTO from './dto/update-category.dto';
import { SupportService } from 'src/core/support.service';
import { I18nService } from 'nestjs-i18n';
import { CategoryResponseDto } from './dto/category-response.dto';
import { CacheService } from '../cache/cache.service';
import { CategoryMapper } from './category.mapper';
import { StorageMixin } from 'src/modules/storage/mixin/file-saving.mixin';

@Injectable()
export class CategoriesService extends SupportService {

    private readonly CACHE_KEY = 'all-categories';

    
    constructor(
        @InjectRepository(CategoryEntity) private categoriesRepository: Repository<CategoryEntity>,
        private readonly cacheService: CacheService<CategoryResponseDto[]>,
        private readonly fileSavingMixin: StorageMixin,
        i18n: I18nService,
        private readonly categoryMapper: CategoryMapper,
    ) {
        super(i18n);
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
     * Search for categories based on a search term and paginate the results.
     *
     * @param {string} term - The search term to filter categories by.
     * @param {number} page - The page number for pagination (default is 1).
     * @param {number} limit - The number of items per page (default is 10).
     * @returns {Promise<CategoryResponseDto[]>} - An array of category response DTOs.
     */
    async searchAndPaginate(term: string, page: number = 1, limit: number = 10): Promise<CategoryResponseDto[]> {
        const offset = (page - 1) * limit;

        const queryBuilder = this.categoriesRepository.createQueryBuilder('category')
            .where('category.name ILIKE :term', { term: `%${term}%` })
            .orderBy('category.name')
            .offset(offset)
            .limit(limit);

        const categories = await queryBuilder.getMany();
        return categories.map(category => this.categoryMapper.mapCategoryToResponseDto(category));
    }

    /**
     * Create a new category.
     * @param createCategoryDto The data for creating the category.
     * @returns The created category response DTO.
     */
    async create(createCategoryDto: CreateCategoryDTO): Promise<CategoryResponseDto> {
        createCategoryDto.image = await this.fileSavingMixin.saveImageFile(createCategoryDto.imageFile);
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
        updateCategoryDto.image = await this.fileSavingMixin.saveImageFile(updateCategoryDto.imageFile, categoryFound.image);
        const updatedCategory = this.categoryMapper.mapUpdateCategoryDtoToEntity(updateCategoryDto, categoryFound);
        const savedCategory = await this.categoriesRepository.save(updatedCategory);
        await this.invalidateCache();
        return this.categoryMapper.mapCategoryToResponseDto(savedCategory);
    }

    /**
     * Delete a category by its ID.
     * @param id The ID of the category to be deleted.
     */
    async delete(id: string): Promise<string> {
        const category = await this.findCategory(id);
        await this.invalidateCache();
        await this.fileSavingMixin.removeImageFile(category.image);
        await this.categoriesRepository.delete(id);
        return this.resolveString("CATEGORY_DELETED_SUCCESSFULLY");
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