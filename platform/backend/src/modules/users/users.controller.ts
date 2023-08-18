import { Body, Controller, Post, Get, UseGuards, Param, UploadedFile, Version, Delete } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/jwt/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtRolesGuard } from '../auth/jwt/jwt-roles.guard';
import { HasRoles } from 'src/modules/auth/jwt/has-roles';
import { JwtRole } from 'src/modules/auth/jwt/jwt-role';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserResponseDto } from './dto/user-response.dto';
import { DefaultUploadFileValidationDecorator } from 'src/core/decorator/default-file.decorator';

/**
 * Controller for managing user operations.
 */
@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UsersController {

    constructor(private usersService: UsersService) {}

    /**
     * Get a list of all users.
     * @returns A list of user response DTOs.
     */
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
    async findAll(): Promise<UserResponseDto[]> {
        return this.usersService.findAll();
    }

    /**
     * Create a new user.
     * @param file The image file for the user.
     * @param userData The data for creating the user.
     * @returns The created user response DTO.
     */
    @HasRoles(JwtRole.ADMIN)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Post()
    @Version('1.0')
    @DefaultUploadFileValidationDecorator()
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: 'Create new user' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async create(
        @UploadedFile() file: Express.Multer.File,
        @Body() userData: CreateUserDto
    ): Promise<UserResponseDto> {
        const user = { ...userData, imageFile: file };
        return this.usersService.create(user);
    }

    /**
     * Update a user's data and profile picture.
     * @param file The updated image file for the user.
     * @param id The ID of the user to update.
     * @param userData The updated user data.
     * @returns The updated user response DTO.
     */
    @HasRoles(JwtRole.ADMIN)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Version('1.0')
    @Post(':id')
    @DefaultUploadFileValidationDecorator({ isOptional: true })
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: 'Update user and profile picture' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async update(
        @UploadedFile() file: Express.Multer.File,
        @Param('id') id: string, 
        @Body() userData: UpdateUserDto
    ): Promise<UserResponseDto>{
        const user = { ...userData, imageFile: file };
        return this.usersService.update(id, user);
    }

    /**
     * Delete a user by ID.
     * @param id The ID of the user to delete.
     */
    @HasRoles(JwtRole.ADMIN)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Delete(':id')
    @ApiOperation({ summary: 'Delete user by ID' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async delete(@Param('id') id: string): Promise<UserResponseDto> {
        return await this.usersService.delete(id);
    }

    /**
     * Search for users by name.
     * @param name The name to search for.
     * @returns A list of users matching the name.
     */
    @HasRoles(JwtRole.ADMIN)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Get('search/:name')
    @ApiOperation({ summary: 'Search users by name' })
    @ApiResponse({
        status: 200,
        description: 'List of users matching the name',
        type: [UserResponseDto],
    })
    async searchByName(@Param('name') name: string): Promise<UserResponseDto[]> {
        return this.usersService.searchByName(name);
    }
}
