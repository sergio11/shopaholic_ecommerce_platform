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

/**
 * Service responsible for handling brand-related operations.
 */
@Injectable()
export class BrandService extends SupportService {
  constructor(
    @InjectRepository(BrandsEntity)
    private brandRepository: Repository<BrandsEntity>,
    private readonly brandMapper: BrandsMapper,
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
    const brands = await this.brandRepository.find();
    return this.brandMapper.mapBrandsToResponseDtos(brands);
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
    let queryBuilder = this.brandRepository.createQueryBuilder('brand');
    if (term) {
      queryBuilder = queryBuilder.where('LOWER(brand.name) LIKE LOWER(:term)', {
        term: `%${term}%`,
      });
    }
    queryBuilder = queryBuilder.orderBy('brand.name');
    const paginatedBrands = await paginate(queryBuilder, options);
    const items = paginatedBrands.items.map((brand) =>
      this.brandMapper.mapBrandToResponseDto(brand),
    );

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
    await this.checkBrandUniqueness(updateBrandDto.name, updateBrandDto.slug);
    const brandToUpdate = await this.findBrand(id);
    updateBrandDto.image = await this.fileSavingMixin.saveImageFile(
      updateBrandDto.imageFile,
      brandToUpdate.image,
    );
    const updatedBrandEntity = this.brandMapper.mapUpdateBrandDtoToEntity(
      updateBrandDto,
      brandToUpdate,
    );
    const updatedBrand = await this.brandRepository.save(updatedBrandEntity);
    return this.brandMapper.mapBrandToResponseDto(updatedBrand);
  }

  /**
   * Removes a brand by its ID.
   * @param id - The ID of the brand to remove.
   * @throws NotFoundException if the brand with the provided ID is not found.
   */
  async remove(id: string): Promise<string> {
    const brandToRemove = await this.findBrand(id);
    await this.fileSavingMixin.removeImageFile(brandToRemove.image);
    await this.brandRepository.remove(brandToRemove);
    return this.resolveString('BRAND_REMOVED_SUCCESFULLY');
  }

  private async findBrand(id: string): Promise<BrandsEntity> {
    return this.findEntityById(id, this.brandRepository, 'BRAND_NOT_FOUND');
  }

  private async checkBrandUniqueness(
    name: string,
    slug: string,
  ): Promise<void> {
    const existingBrand = await this.brandRepository
      .createQueryBuilder('brand')
      .where('brand.name = :name OR brand.slug = :slug', { name, slug })
      .getOne();

    if (existingBrand) {
      this.throwConflictException('BRAND_ALREADY_EXISTS');
    }
  }
}
