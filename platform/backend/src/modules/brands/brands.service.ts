import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BrandsMapper } from './brands.mapper';
import { BrandResponseDTO } from './dto/brand-response.dto';
import { BrandsEntity } from './brand.entity';
import { CreateBrandDTO } from './dto/create-brand.dto';
import { UpdateBrandDTO } from './dto/update-brand.dto';

/**
 * Service responsible for handling brand-related operations.
 */
@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(BrandsEntity) private brandRepository: Repository<BrandsEntity>,
    private readonly brandMapper: BrandsMapper,
  ) {}

  /**
   * Retrieves all brands.
   * @returns An array of BrandResponseDto objects representing the brands.
   */
  async findAll(): Promise<BrandResponseDTO[]> {
    const brands = await this.brandRepository.find();
    return this.brandMapper.mapBrandsToResponseDtos(brands);
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
    const brandEntity = this.brandMapper.mapCreateBrandDtoToEntity(createBrandDto);
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
  async update(id: string, updateBrandDto: UpdateBrandDTO): Promise<BrandResponseDTO> {
    const brandToUpdate = await this.findBrand(id);
    const updatedBrandEntity = this.brandMapper.mapUpdateBrandDtoToEntity(updateBrandDto, brandToUpdate);
    const updatedBrand = await this.brandRepository.save(updatedBrandEntity);
    return this.brandMapper.mapBrandToResponseDto(updatedBrand);
  }

  /**
   * Removes a brand by its ID.
   * @param id - The ID of the brand to remove.
   * @throws NotFoundException if the brand with the provided ID is not found.
   */
  async remove(id: string): Promise<void> {
    const brandToRemove = await this.findBrand(id);
    await this.brandRepository.remove(brandToRemove);
  }

  private async findBrand(id: string): Promise<BrandsEntity> {
    const brand = await this.brandRepository.findOne({ where: { id: id } });
    if (!brand) {
      throw new NotFoundException('Brand not found');
    }
    return brand;
  }
}