import { Controller, UseGuards, Get, Param, Post, Body, Put, Delete, Query, DefaultValuePipe, ParseIntPipe, UploadedFiles, Version, HttpStatus, UseInterceptors, ParseFilePipeBuilder, ParseFilePipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { HasRoles } from '../auth/jwt/has-roles';
import { JwtRole } from '../auth/jwt/jwt-role';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { JwtRolesGuard } from '../auth/jwt/jwt-roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { ProductEntity } from './product.entity';
import { API } from 'src/config/config';
import { ApiBearerAuth, ApiTags, ApiResponse, ApiConsumes } from '@nestjs/swagger';
import { ProductResponseDto } from './dto/product-response.dto';

/**
 * Controller handling CRUD operations for products.
 */
@ApiBearerAuth()
@ApiTags('products')
@Controller('products')
export class ProductsController {

    /**
     * Build a ParseFilePipe with specific validation rules.
     */
    private static parseFilePipeBuilder(fileIsRequired: boolean): ParseFilePipe {
        return new ParseFilePipeBuilder()
            .addFileTypeValidator({
                fileType: '.(png|jpeg|jpg)',
            })
            .addMaxSizeValidator({
                maxSize: 1024 * 1024 * 10,
            })
            .build({
                fileIsRequired,
                errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
            });
    }

    /**
     * Constructs the ProductsController.
     * @param productsService - The injected ProductsService instance.
     */
    constructor(private productsService: ProductsService) {}

    /**
     * Retrieves a list of all products.
     * @returns An array of ProductResponseDto representing all products.
     */
    @HasRoles(JwtRole.ADMIN, JwtRole.CLIENT)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Version('1.0')
    @Get()
    @ApiResponse({ status: 200, description: 'Retrieved all products.', type: ProductResponseDto, isArray: true })
    async findAll(): Promise<ProductResponseDto[]> {
        return this.productsService.findAll();
    }

    /**
     * Retrieves paginated products.
     * @param page - Page number.
     * @param limit - Number of items per page.
     * @returns A Pagination object containing paginated products.
     */
    @HasRoles(JwtRole.ADMIN, JwtRole.CLIENT)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Version('1.0')
    @Get('pagination')
    @ApiResponse({ status: 200, description: 'Retrieved paginated products.', type: Pagination, isArray: false })
    async pagination(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit: number = 5,
    ): Promise<Pagination<ProductEntity>> {
        return this.productsService.paginate({
            page,
            limit,
            route: `http://${API}:3000/products/pagination`
        });
    }

    /**
     * Retrieves products by category.
     * @param id_category - The ID of the category.
     * @returns An array of ProductResponseDto representing products in the category.
     */
    @HasRoles(JwtRole.ADMIN, JwtRole.CLIENT)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Version('1.0')
    @Get('category/:id_category')
    @ApiResponse({ status: 200, description: 'Retrieved products by category.', type: ProductResponseDto, isArray: true })
    async findByCategory(@Param('id_category') id_category: string): Promise<ProductResponseDto[]> {
        return this.productsService.findByCategory(id_category);
    }

    /**
     * Retrieves products by name.
     * @param name - The product name or part of it.
     * @returns An array of ProductResponseDto matching the provided name.
     */
    @HasRoles(JwtRole.ADMIN, JwtRole.CLIENT)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Version('1.0')
    @Get('search/:name')
    @ApiResponse({ status: 200, description: 'Retrieved products by name.', type: ProductResponseDto, isArray: true })
    async findByName(@Param('name') name: string): Promise<ProductResponseDto[]> {
        return this.productsService.findByName(name);
    }

    /**
     * Creates a new product with associated images.
     * @param mainImageFile - Main product image file.
     * @param secondaryImageFile - Secondary product image file.
     * @param product - The product data.
     * @returns The created ProductResponseDto.
     */
    @HasRoles(JwtRole.ADMIN)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Version('1.0')
    @Post()
    @UseInterceptors(FileInterceptor('mainImageFile'), FileInterceptor('secondaryImageFile'))
    @ApiConsumes('multipart/form-data')
    @ApiResponse({ status: 201, description: 'Product created successfully.', type: ProductResponseDto })
    async create(
        @UploadedFiles(ProductsController.parseFilePipeBuilder(true)) mainImageFile: Express.Multer.File,
        @UploadedFiles(ProductsController.parseFilePipeBuilder(true)) secondaryImageFile: Express.Multer.File,
        @Body() product: CreateProductDto
    ): Promise<ProductResponseDto> {
        return this.productsService.create([mainImageFile, secondaryImageFile], product);
    }

    /**
     * Updates a product by ID with associated images.
     * @param mainImageFile - Main product image file.
     * @param secondaryImageFile - Secondary product image file.
     * @param id - The ID of the product to update.
     * @param product - The updated product data.
     * @returns The updated ProductResponseDto.
     */
    @HasRoles(JwtRole.ADMIN)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Version('1.0')
    @Put(':id')
    @UseInterceptors(FileInterceptor('mainImageFile'), FileInterceptor('secondaryImageFile'))
    @ApiConsumes('multipart/form-data')
    @ApiResponse({ status: 200, description: 'Product updated successfully.', type: ProductResponseDto })
    async update(
        @UploadedFiles(ProductsController.parseFilePipeBuilder(false)) mainImageFile: Express.Multer.File,
        @UploadedFiles(ProductsController.parseFilePipeBuilder(false)) secondaryImageFile: Express.Multer.File,
        @Param('id') id: string,
        @Body() product: UpdateProductDto
    ): Promise<ProductResponseDto> {
        return this.productsService.update(id, product, [mainImageFile, secondaryImageFile]);
    }

    /**
     * Deletes a product by ID.
     * @param id - The ID of the product to delete.
     */
    @HasRoles(JwtRole.ADMIN)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Version('1.0')
    @Delete(':id')
    @ApiResponse({ status: 200, description: 'Product deleted successfully.' })
    async delete(
        @Param('id') id: string,
    ) {
        return this.productsService.delete(id);
    }
}