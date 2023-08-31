import {
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpStatus,
  Version,
  ParseIntPipe,
  Query,
  DefaultValuePipe,
  UploadedFiles,
} from '@nestjs/common';
import { ApiResponse, ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import { BrandService } from './brands.service';
import { JwtRole } from '../auth/jwt/jwt-role';
import { BrandResponseDTO } from './dto/brand-response.dto';
import { CreateBrandDTO } from './dto/create-brand.dto';
import { UpdateBrandDTO } from './dto/update-brand.dto';
import { DefaultUploadFileValidationDecorator } from 'src/core/decorator/default-file.decorator';
import { Auth } from '../auth/decorator/auth.decorator';
import { ApiController } from 'src/core/decorator/default-api.decorator';
import { Pagination } from 'nestjs-typeorm-paginate';

/**
 * Controller responsible for managing brands.
 */
@ApiController('brands')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  /**
   * Retrieves all brands.
   * @returns An array of BrandResponseDto representing the brands.
   */
  @Auth(JwtRole.ADMIN)
  @Version('1.0')
  @Get()
  @ApiOkResponse({
    description: 'Retrieved all brands.',
    type: BrandResponseDTO,
    isArray: true,
  })
  async findAll(): Promise<BrandResponseDTO[]> {
    return this.brandService.findAll();
  }

  /**
   * Retrieves brands based on a search term and pagination.
   *  @param {string} term - The search term to filter categories by.
   * @param {number} page - The page number for pagination (default is 1).
   * @param {number} limit - The number of items per page (default is 10).
   * @returns {Promise<Pagination<BrandResponseDTO>>} - A paginated result of brands response DTOs.
   */
  @Auth(JwtRole.ADMIN)
  @Get('search')
  @ApiQuery({
    name: 'term',
    required: false,
    description: 'Search term for filtering brands',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number (1 .. )',
    example: 1,
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Items per page (1 - 100)',
    example: 10,
    type: Number,
  })
  @ApiOkResponse({
    description: 'Retrieved filtered and paginated brands.',
    type: BrandResponseDTO,
    isArray: true,
  })
  async searchBrands(
    @Query('term') searchTerm: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ): Promise<Pagination<BrandResponseDTO>> {
    return this.brandService.searchAndPaginateBrands(searchTerm, page, limit);
  }

  /**
   * Retrieves a brand by its ID.
   * @param id - The ID of the brand.
   * @returns A BrandResponseDto representing the brand.
   */
  @Auth(JwtRole.ADMIN, JwtRole.CLIENT)
  @Version('1.0')
  @Get(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Retrieved a brand by ID.',
    type: BrandResponseDTO,
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<BrandResponseDTO> {
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
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Brand created successfully.',
    type: BrandResponseDTO,
  })
  async create(
    @UploadedFiles()
    files: { imageFile: Express.Multer.File },
    @Body() createBrandDto: CreateBrandDTO,
  ): Promise<BrandResponseDTO> {
    const brand = { ...createBrandDto, imageFile: files.imageFile };
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
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Brand updated successfully.',
    type: BrandResponseDTO,
  })
  async update(
    @UploadedFiles()
    files: { imageFile: Express.Multer.File },
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBrandDto: UpdateBrandDTO,
  ): Promise<BrandResponseDTO> {
    const brand = { ...updateBrandDto, imageFile: files.imageFile };
    return this.brandService.update(id, brand);
  }

  /**
   * Deletes a brand by its ID.
   * @param id - The ID of the brand to delete.
   */
  @Auth(JwtRole.ADMIN)
  @Version('1.0')
  @Delete(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Brand deleted successfully.',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<string> {
    return this.brandService.remove(id);
  }
}
