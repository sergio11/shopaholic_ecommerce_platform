import { UploadedFile, Param, Body, Post, Get, Delete, Version} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { JwtRole } from '../auth/jwt/jwt-role';
import CreateCategoryDTO from './dto/create-category.dto';
import UpdateCategoryDTO from './dto/update-category.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CategoryResponseDto } from './dto/category-response.dto';
import { DefaultUploadFileValidationDecorator } from 'src/core/decorator/default-file.decorator';
import { Auth } from '../auth/decorator/auth.decorator';
import { ApiController } from 'src/core/decorator/default-api.decorator';


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
        @UploadedFile() file: Express.Multer.File,
        @Body() createCategoryData: CreateCategoryDTO
    ): Promise<CategoryResponseDto> {
        const category = { ...createCategoryData, imageFile: file}
        return this.categoriesService.create(category);
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
        @UploadedFile() file: Express.Multer.File,
        @Param('id') id: string,
        @Body() categoryData: UpdateCategoryDTO
    ): Promise<CategoryResponseDto> {
        const category = { ...categoryData, imageFile: file}
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
        description: 'Category successfully deleted'
    })
    async delete(@Param('id') id: string) {
        return this.categoriesService.delete(id);
    }
}