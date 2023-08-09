import { Controller, UseGuards, Put, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, Param, Body, Post, Get, Delete, Version, HttpStatus, ParseFilePipeBuilder } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { HasRoles } from '../auth/jwt/has-roles';
import { JwtRole } from '../auth/jwt/jwt-role';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { JwtRolesGuard } from '../auth/jwt/jwt-roles.guard';
import CreateCategoryDTO from './dto/create-category.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import UpdateCategoryDTO from './dto/update-category.dto';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CategoryEntity } from './category.entity';

@ApiBearerAuth()
@ApiTags('categories')
@Controller('categories')
export class CategoriesController {

    constructor(private categoriesService: CategoriesService) {}

    @HasRoles(JwtRole.CLIENT, JwtRole.ADMIN)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Version('1.0')
    @Get()
    @ApiOperation({ summary: 'Return all categories registered' })
    @ApiResponse({
        status: 200,
        description: 'All categories registered',
        type: CategoryEntity,
    })
    findAll() {
        return this.categoriesService.findAll();
    }

    @HasRoles(JwtRole.ADMIN)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Version('1.0')
    @Post()
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: 'Allow us to create a new category' })
    @ApiResponse({
        status: 200,
        description: 'New category successfully created',
        type: CategoryEntity,
    })
    createWithImage(
        @UploadedFile(
            new ParseFilePipeBuilder()
                .addFileTypeValidator({
                    fileType: '.(png|jpeg|jpg)',
                })
                .addMaxSizeValidator({
                    maxSize: 1024 * 1024 * 10
                })
                .build({
                    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
                }),
        ) file: Express.Multer.File,
        @Body() category: CreateCategoryDTO
    ) {
        console.log("Categories - create new one");
        console.log(file);
        console.log(category);
        return this.categoriesService.create(file,category);
    }
    
    @HasRoles(JwtRole.ADMIN)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Version('1.0')
    @Put(':id')
    @ApiOperation({ summary: 'Allow us to update an existing category' })
    @ApiResponse({
        status: 200,
        description: 'Category successfully updated',
        type: CategoryEntity,
    })
    update( 
        @Param('id') id: string, 
        @Body() category: UpdateCategoryDTO
    ) {
        return this.categoriesService.update(id, category);
    }

    @HasRoles(JwtRole.ADMIN)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Version('1.0')
    @Put('upload/:id')
    @UseInterceptors(FileInterceptor('file'))
    updateWithImage(
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                  new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 10 }),
                  new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
                ],
              }),
        ) file: Express.Multer.File,
        @Param('id') id: string,
        @Body() category: UpdateCategoryDTO
    ) {
        return this.categoriesService.updateWithImage(file, id, category);
    }


    @HasRoles(JwtRole.ADMIN)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Version('1.0')
    @Delete(':id')
    @ApiOperation({ summary: 'Allow us to delete a category' })
    @ApiResponse({
        status: 200,
        description: 'Category successfully deleted',
        type: CategoryEntity,
    })
    delete(@Param('id') id: string) {
        return this.categoriesService.delete(id);
    }

}

