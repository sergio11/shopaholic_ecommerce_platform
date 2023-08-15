import { Body, Controller, Post, Get, UseGuards, Put, Param, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, Version, ParseFilePipeBuilder, HttpStatus } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/jwt/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtRolesGuard } from '../auth/jwt/jwt-roles.guard';
import { HasRoles } from 'src/modules/auth/jwt/has-roles';
import { JwtRole } from 'src/modules/auth/jwt/jwt-role';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserResponseDto } from './dto/user-response.dto';

@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UsersController {

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

    constructor(private usersService: UsersService) {}

    
    @HasRoles(JwtRole.ADMIN)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Version('1.0')
    @Get()
    @ApiOperation({ summary: 'Get users' })
    @ApiResponse({
        status: 200,
        description: 'User list',
        type: UserResponseDto,
    })
    findAll() {
        return this.usersService.findAll();
    }

    @HasRoles(JwtRole.ADMIN)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Post()
    @Version('1.0')
    @UseInterceptors(FileInterceptor('imageFile'))
    @ApiOperation({ summary: 'Create new user' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiConsumes('multipart/form-data')
    create(
        @UploadedFile(UsersController.parseFilePipeBuilder(true)) file: Express.Multer.File,
        @Body() user: CreateUserDto
    ) {
        return this.usersService.create(user, file);
    }

    
    @HasRoles(JwtRole.ADMIN)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Version('1.0')
    @Post(':id')
    @UseInterceptors(FileInterceptor('imageFile'))
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: 'Update user and profile picture' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    update(
        @UploadedFile(UsersController.parseFilePipeBuilder(false)) file: Express.Multer.File,
        @Param('id') id: string, 
        @Body() user: UpdateUserDto
    ) {
        return this.usersService.update(id, user, file);
    }
}
