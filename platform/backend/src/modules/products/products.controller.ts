import { Controller, UseGuards, Put, UseInterceptors, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, Param, Body, ParseIntPipe, Post, Get, Delete, UploadedFiles, Query, DefaultValuePipe, Version } from '@nestjs/common';
import { ProductsService } from './products.service';
import { HasRoles } from '../auth/jwt/has-roles';
import { JwtRole } from '../auth/jwt/jwt-role';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { JwtRolesGuard } from '../auth/jwt/jwt-roles.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { ProductEntity } from './product.entity';
import { API } from 'src/config/config';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('products')
@Controller('products')
export class ProductsController {

    constructor(private productsService: ProductsService) {}

    @HasRoles(JwtRole.ADMIN, JwtRole.CLIENT)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Version('1.0')
    @Get()
    findAll() {
        return this.productsService.findAll();
    }

    @HasRoles(JwtRole.ADMIN, JwtRole.CLIENT)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Version('1.0')
    @Get('pagination')
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

    @HasRoles(JwtRole.ADMIN, JwtRole.CLIENT)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Version('1.0')
    @Get('category/:id_category')
    findByCategory(@Param('id_category') id_category: string) {
        return this.productsService.findByCategory(id_category);
    }
    
    @HasRoles(JwtRole.ADMIN, JwtRole.CLIENT)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Version('1.0')
    @Get('search/:name')
    findByName(@Param('name') name: string) {
        return this.productsService.findByName(name);
    }

    @HasRoles(JwtRole.ADMIN)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Version('1.0')
    @Post()
    @UseInterceptors(FilesInterceptor('files[]', 2))
    create(
        @UploadedFiles(
            new ParseFilePipe({
                validators: [
                  new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 10 }),
                  new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
                ],
              }),
        ) files: Array<Express.Multer.File>,
        @Body() product: CreateProductDto
    ) {
        console.log('Files: ', files);
        console.log('Product: ', product);
        
        return this.productsService.create(files, product);
    }
    
    @HasRoles(JwtRole.ADMIN)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Version('1.0')
    @Put('upload/:id')
    @UseInterceptors(FilesInterceptor('files[]', 2))
    updateWithImage(
        @UploadedFiles(
            new ParseFilePipe({
                validators: [
                  new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 10 }),
                  new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
                ],
              }),
        ) files: Array<Express.Multer.File>,
        @Param('id') id: string,
        @Body() product: UpdateProductDto
    ) {
        console.log('Product: ', product);
        
        return this.productsService.updateWithImages(files, id, product);
    }
    
    @HasRoles(JwtRole.ADMIN)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Version('1.0')
    @Put(':id')
    update(
        @Param('id') id: string,
        @Body() product: UpdateProductDto
    ) {
        return this.productsService.update(id, product);
    }
    
    @HasRoles(JwtRole.ADMIN)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Version('1.0')
    @Delete(':id')
    delete(
        @Param('id') id: string,
    ) {
        return this.productsService.delete(id);
    }

}