import { Controller, Get, Post, Body, Param, Delete, ParseUUIDPipe, HttpStatus, Version, UploadedFile } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiResponse, ApiOkResponse } from '@nestjs/swagger';
import { BrandService } from './brands.service';
import { JwtRole } from '../auth/jwt/jwt-role';
import { BrandResponseDTO } from './dto/brand-response.dto';
import { CreateBrandDTO } from './dto/create-brand.dto';
import { UpdateBrandDTO } from './dto/update-brand.dto';
import { DefaultUploadFileValidationDecorator } from 'src/core/decorator/default-file.decorator';
import { Auth } from '../auth/decorator/auth.decorator';

/**
 * Controller responsible for managing brands.
 */
@ApiBearerAuth()
@ApiTags('brands')
@Controller('brands')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  /**
   * Retrieves all brands.
   * @returns An array of BrandResponseDto representing the brands.
   */
  @Auth(JwtRole.ADMIN)
  @Version('1.0')
  @Get()
  @ApiOkResponse({ description: 'Retrieved all brands.', type: BrandResponseDTO, isArray: true })
  async findAll(): Promise<BrandResponseDTO[]> {
    return this.brandService.findAll();
  }

  /**
   * Retrieves a brand by its ID.
   * @param id - The ID of the brand.
   * @returns A BrandResponseDto representing the brand.
   */
  @Auth(JwtRole.ADMIN, JwtRole.CLIENT)
  @Version('1.0')
  @Get(':id')
  @ApiResponse({ status: HttpStatus.OK, description: 'Retrieved a brand by ID.', type: BrandResponseDTO })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<BrandResponseDTO> {
    return this.brandService.findOne(id);
  }

  /**
   * Creates a new brand.
   * @param createBrandDto - The data to create a brand.
   * @returns A BrandResponseDto representing the created brand.
   */
  @Auth(JwtRole.ADMIN)
  @Version('1.0')
  @Post()
  @DefaultUploadFileValidationDecorator()
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Brand created successfully.', type: BrandResponseDTO })
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createBrandDto: CreateBrandDTO
  ): Promise<BrandResponseDTO> {
    const brand = { ...createBrandDto, imageFile: file};
    return this.brandService.create(brand);
  }

  /**
   * Updates a brand by its ID.
   * @param id - The ID of the brand to update.
   * @param updateBrandDto - The data to update the brand.
   * @returns A BrandResponseDto representing the updated brand.
   */
  @Auth(JwtRole.ADMIN)
  @Version('1.0')
  @Post(':id')
  @DefaultUploadFileValidationDecorator({ isOptional: true })
  @ApiResponse({ status: HttpStatus.OK, description: 'Brand updated successfully.', type: BrandResponseDTO })
  async update(
    @UploadedFile() file: Express.Multer.File,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBrandDto: UpdateBrandDTO
  ): Promise<BrandResponseDTO> {
    const brand = { ...updateBrandDto, imageFile: file};
    return this.brandService.update(id, brand);
  }

  /**
   * Deletes a brand by its ID.
   * @param id - The ID of the brand to delete.
   */
  @Auth(JwtRole.ADMIN)
  @Version('1.0')
  @Delete(':id')
  @ApiResponse({ status: HttpStatus.OK, description: 'Brand deleted successfully.' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.brandService.remove(id);
  }
}