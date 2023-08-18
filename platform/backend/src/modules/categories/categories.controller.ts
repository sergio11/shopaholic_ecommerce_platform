import { Controller, UseGuards, UploadedFile, Param, Body, Post, Get, Delete, Version} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { HasRoles } from '../auth/jwt/has-roles';
import { JwtRole } from '../auth/jwt/jwt-role';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { JwtRolesGuard } from '../auth/jwt/jwt-roles.guard';
import CreateCategoryDTO from './dto/create-category.dto';
import UpdateCategoryDTO from './dto/update-category.dto';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CategoryResponseDto } from './dto/category-response.dto';
import { DefaultUploadFileValidationDecorator } from 'src/core/decorator/default-file.decorator';

@ApiBearerAuth()
@ApiTags('categories')
@Controller('categories')
export class CategoriesController {

    constructor(private categoriesService: CategoriesService) {}

    /**
     * Get all registered categories.
     * @returns An array of category response DTOs.
     */
    @HasRoles(JwtRole.CLIENT, JwtRole.ADMIN)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
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
    @HasRoles(JwtRole.ADMIN)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Version('1.0')
    @Post()
    @DefaultUploadFileValidationDecorator()
    @ApiConsumes('multipart/form-data')
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
    @HasRoles(JwtRole.ADMIN)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Version('1.0')
    @Post(':id')
    @DefaultUploadFileValidationDecorator({ isOptional: true })
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: 'Allow us to update an existing category' })
    @ApiResponse({
        status: 200,
        description: 'Category successfully updated',
        type: CategoryResponseDto,
    })
    async update(
        @UploadedFile() file: Express.Multer.File,
        @Param('id') id: string,
        @Body() category: UpdateCategoryDTO
    ): Promise<CategoryResponseDto> {
        return this.categoriesService.update(id, category, file);
    }

    /**
     * Delete a category by its ID.
     * @param id The ID of the category to be deleted.
     */
    @HasRoles(JwtRole.ADMIN)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
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