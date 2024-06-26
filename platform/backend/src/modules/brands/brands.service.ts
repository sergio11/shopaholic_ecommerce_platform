import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BrandsMapper } from './brands.mapper';
import { BrandResponseDTO } from './dto/brand-response.dto';
import { BrandsEntity } from './brand.entity';
import { CreateBrandDTO } from './dto/create-brand.dto';
import { UpdateBrandDTO } from './dto/update-brand.dto';
import { SupportService } from 'src/core/support.service';
import { I18nService } from 'nestjs-i18n';
import { StorageMixin } from '../storage/mixin/file-saving.mixin';
import { Pagination, paginate } from 'nestjs-typeorm-paginate';
import { CacheService } from '../cache/cache.service';

/**
 * Service responsible for handling brand-related operations.
 */
@Injectable()
export class BrandService extends SupportService {

  private readonly CACHE_KEY = 'cache:brands:all';
  private readonly DEFAULT_TTL_IN_SECONDS: number = 120;

  constructor(
    @InjectRepository(BrandsEntity)
    private brandRepository: Repository<BrandsEntity>,
    private readonly brandMapper: BrandsMapper,
    private readonly cacheService: CacheService<BrandResponseDTO[]>,
    private readonly fileSavingMixin: StorageMixin,
    i18n: I18nService,
  ) {
    super(i18n);
  }

  /**
   * Retrieves all brands.
   * @returns An array of BrandResponseDto objects representing the brands.
   */
  async findAll(): Promise<BrandResponseDTO[]> {
    const cachedBrands = await this.cacheService.get(this.CACHE_KEY);
    if (cachedBrands) {
      return cachedBrands;
    }
    const brands = await this.brandRepository.find({relations: ["image"]});
    const brandDtos = await this.brandMapper.mapBrandsToResponseDtos(brands);
    await this.cacheService.set(
      this.CACHE_KEY,
      brandDtos,
      this.DEFAULT_TTL_IN_SECONDS,
    );
    return brandDtos;
  }

  /**
   * Search for brands based on a search term and paginate the results.
   *
   * @param {string} term - The search term to filter brands by.
   * @param {number} page - The page number for pagination (default is 1).
   * @param {number} limit - The number of items per page (default is 10).
   * @returns {Promise<Pagination<BrandResponseDTO>} - An array of BrandResponseDTO representing the filtered and paginated brands.
   */
  async searchAndPaginateBrands(
    term: string,
    page: number,
    limit: number,
  ): Promise<Pagination<BrandResponseDTO>> {
    if (page < 1) {
      this.throwBadRequestException('PAGE_NUMBER_NOT_VALID');
    }
    if (limit < 1 || limit > 100) {
      this.throwBadRequestException('LIMIT_NUMBER_NOT_VALID');
    }
    const options = { page, limit };
    let queryBuilder = this.brandRepository.createQueryBuilder('brand')
        .leftJoinAndSelect('brand.image', 'image')
    if (term) {
      queryBuilder = queryBuilder.where('LOWER(brand.name) LIKE LOWER(:term)', {
        term: `%${term}%`,
      });
    }
    queryBuilder = queryBuilder.orderBy('brand.name');
    const paginatedBrands = await paginate(queryBuilder, options);
    const items = await this.brandMapper.mapBrandsToResponseDtos(paginatedBrands.items);
    
    return {
      ...paginatedBrands,
      items,
    };
  }

  /**
   * Retrieves a single brand by its ID.
   * @param id - The ID of the brand.
   * @returns A BrandResponseDto representing the brand.
   * @throws NotFoundException if the brand with the provided ID is not found.
   */
  async findOne(id: string): Promise<BrandResponseDTO> {
    const brand = await this.findBrand(id);
    return this.brandMapper.mapBrandToResponseDto(brand);
  }

  /**
   * Creates a new brand.
   * @param createBrandDto - The data for creating the brand.
   * @returns A BrandResponseDto representing the newly created brand.
   */
  async create(createBrandDto: CreateBrandDTO): Promise<BrandResponseDTO> {
    await this.checkBrandUniqueness(createBrandDto.name, createBrandDto.slug);
    createBrandDto.image = await this.fileSavingMixin.saveImageFile(
      createBrandDto.imageFile,
    );
    const brandEntity =
      this.brandMapper.mapCreateBrandDtoToEntity(createBrandDto);
    const createdBrand = await this.brandRepository.save(brandEntity);
    await this.invalidateCache();
    return this.brandMapper.mapBrandToResponseDto(createdBrand);
  }

  /**
   * Updates an existing brand by its ID.
   * @param id - The ID of the brand to update.
   * @param updateBrandDto - The updated data for the brand.
   * @returns A BrandResponseDto representing the updated brand.
   * @throws NotFoundException if the brand with the provided ID is not found.
   */
  async update(
    id: string,
    updateBrandDto: UpdateBrandDTO,
  ): Promise<BrandResponseDTO> {
    await this.checkBrandUniqueness(updateBrandDto.name, updateBrandDto.slug, id);
    const brandToUpdate = await this.findBrand(id);
    if(updateBrandDto.imageFile) {
      updateBrandDto.image = await this.fileSavingMixin.saveImageFile(
        updateBrandDto.imageFile,
        brandToUpdate.image,
      );
    }
    const updatedBrandEntity = this.brandMapper.mapUpdateBrandDtoToEntity(
      updateBrandDto,
      brandToUpdate,
    );
    const updatedBrand = await this.brandRepository.save(updatedBrandEntity);
    await this.invalidateCache();
    return this.brandMapper.mapBrandToResponseDto(updatedBrand);
  }

  /**
   * Removes a brand by its ID.
   * @param id - The ID of the brand to remove.
   * @throws NotFoundException if the brand with the provided ID is not found.
   */
  async remove(id: string): Promise<string> {
    const brandToRemove = await this.findBrand(id);
    await this.brandRepository.remove(brandToRemove);
    await this.fileSavingMixin.removeImageFile(brandToRemove.image);
    await this.invalidateCache();
    return this.resolveString('BRAND_REMOVED_SUCCESFULLY');
  }

  private async findBrand(id: string): Promise<BrandsEntity> {
    return this.findEntityById(id, this.brandRepository, 'BRAND_NOT_FOUND', ["image"]);
  }

  /**
   * Checks the uniqueness of a brand by name and slug, optionally excluding a brand with a specific ID.
   * @param {string} name - The name of the brand.
   * @param {string} slug - The slug of the brand.
   * @param {string} [id] - The ID of the brand to exclude from the uniqueness check (optional, defaults to undefined).
   * @returns {Promise<void>} A Promise that resolves if the brand is unique, otherwise throws a conflict exception.
   */
  private async checkBrandUniqueness(
    name: string,
    slug: string,
    id?: string
  ): Promise<void> {
    let queryBuilder = this.brandRepository.createQueryBuilder('brand')
        .where('brand.name = :name', { name })
        .orWhere('brand.slug = :slug', { slug })
    const existingBrand = await queryBuilder.getOne();
    if (existingBrand && (id == undefined || existingBrand.id != id)) {
      this.throwConflictException('BRAND_ALREADY_EXISTS');
    }
  }

  /**
   * Invalidate the cache storing category data.
   * @private
   */
  private async invalidateCache() {
    await this.cacheService.delete(this.CACHE_KEY);
  }
}
