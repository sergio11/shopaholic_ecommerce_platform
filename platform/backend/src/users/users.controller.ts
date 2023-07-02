import { Body, Controller, Post, Get, UseGuards, Put, Param, ParseIntPipe, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtRolesGuard } from '../auth/jwt/jwt-roles.guard';
import { HasRoles } from 'src/auth/jwt/has-roles';
import { JwtRole } from 'src/auth/jwt/jwt-role';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from './user.entity';

@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UsersController {

    constructor(private usersService: UsersService) {}

    
    @HasRoles(JwtRole.CLIENT)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Get()
    @ApiOperation({ summary: 'Get users' })
    @ApiResponse({
        status: 200,
        description: 'User list',
        type: User,
    })
    findAll() {
        return this.usersService.findAll();
    }

    @Post()
    @ApiOperation({ summary: 'Create new user' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    create(@Body() user: CreateUserDto) {
        return this.usersService.create(user);
    }
    
    @HasRoles(JwtRole.CLIENT)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Put(':id')
    @ApiOperation({ summary: 'Update user' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    update(@Param('id', ParseIntPipe) id: number, @Body() user: UpdateUserDto) {
        return this.usersService.update(id, user);
    }

    @HasRoles(JwtRole.CLIENT)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Post('upload/:id')
    @ApiOperation({ summary: 'Update user and profile picture' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
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
        @Param('id', ParseIntPipe) id: number, 
        @Body() user: UpdateUserDto
    ) {
        return this.usersService.updateWithImage(file, id, user);
    }
    

}
