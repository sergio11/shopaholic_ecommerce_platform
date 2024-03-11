import {
  Param,
  Body,
  Post,
  Get,
  Delete,
  Version,
  ParseIntPipe,
  Query,
  DefaultValuePipe,
  UploadedFiles,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { JwtRole } from '../auth/jwt/jwt-role';
import CreateCategoryDTO from './dto/create-category.dto';
import UpdateCategoryDTO from './dto/update-category.dto';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { CategoryResponseDto } from './dto/category-response.dto';
import { DefaultUploadFileValidationDecorator } from 'src/core/decorator/default-file.decorator';
import { Auth } from '../auth/decorator/auth.decorator';
import { ApiController } from 'src/core/decorator/default-api.decorator';
import { Pagination } from 'nestjs-typeorm-paginate';

@ApiController('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  /**
   * Get all registered categories.
   * @returns An array of category response DTOs.
   */
  @Auth(JwtRole.CLIENT, JwtRole.ADMIN)
  @Version('1.0')
  @Get()
  @ApiOperation({ summary: 'Return all categories registered' })
  @ApiResponse({
    status: 200,
    description: 'All categories registered',
    type: CategoryResponseDto,
    isArray: true,
  })
  async findAll(): Promise<CategoryResponseDto[]> {
    return this.categoriesService.findAll();
  }

  /**
   * Create a new category.
   * @param file The image file for the category.
   * @param category The data for creating the category.
   * @returns The created category response DTO.
   */
  @Auth(JwtRole.ADMIN)
  @Version('1.0')
  @Post()
  @DefaultUploadFileValidationDecorator()
  @ApiOperation({ summary: 'Allow us to create a new category' })
  @ApiResponse({
    status: 200,
    description: 'New category successfully created',
    type: CategoryResponseDto,
  })
  async create(
    @UploadedFiles()
    files: { imageFile: Express.Multer.File },
    @Body() createCategoryData: CreateCategoryDTO,
  ): Promise<CategoryResponseDto> {
    const category = { ...createCategoryData, imageFile: files.imageFile[0] };
    console.log("Create category", category);
    return this.categoriesService.create(category);
  }

  /**
   * Search for categories based on a search term and paginate the results.
   *
   * @param {string} term - The search term to filter categories by.
   * @param {number} page - The page number for pagination (default is 1).
   * @param {number} limit - The number of items per page (default is 10).
   * @returns {Promise<Pagination<CategoryResponseDto>>} - A paginated result of category response DTOs.
   */
  @Auth(JwtRole.CLIENT, JwtRole.ADMIN)
  @Version('1.0')
  @Get('search')
  @ApiQuery({
    name: 'term',
    required: false,
    description: 'Search term for filtering categories',
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
  @ApiOperation({
    summary:
      'Search for categories based on a search term and paginate the results',
  })
  @ApiResponse({
    status: 200,
    description: 'Filtered and paginated categories',
    type: CategoryResponseDto,
    isArray: true,
  })
  async searchAndPaginate(
    @Query('term') term: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ): Promise<Pagination<CategoryResponseDto>> {
    return this.categoriesService.searchAndPaginate(term, page, limit);
  }

  /**
   * Update an existing category.
   * @param file The updated image file for the category.
   * @param id The ID of the category to be updated.
   * @param category The updated category data.
   * @returns The updated category response DTO.
   */
  @Auth(JwtRole.ADMIN)
  @Version('1.0')
  @Post(':id')
  @DefaultUploadFileValidationDecorator({ isOptional: true })
  @ApiOperation({ summary: 'Allow us to update an existing category' })
  @ApiResponse({
    status: 200,
    description: 'Category successfully updated',
    type: CategoryResponseDto,
  })
  async update(
    @UploadedFiles()
    files: { imageFile?: Express.Multer.File },
    @Param('id') id: string,
    @Body() categoryData: UpdateCategoryDTO,
  ): Promise<CategoryResponseDto> {
    const category = { ...categoryData, imageFile: files.imageFile[0] };
    return this.categoriesService.update(id, category);
  }

  /**
   * Delete a category by its ID.
   * @param id The ID of the category to be deleted.
   */
  @Auth(JwtRole.ADMIN)
  @Version('1.0')
  @Delete(':id')
  @ApiOperation({ summary: 'Allow us to delete a category' })
  @ApiResponse({
    status: 200,
    description: 'Category successfully deleted',
  })
  async delete(@Param('id') id: string) {
    return this.categoriesService.delete(id);
  }
}
