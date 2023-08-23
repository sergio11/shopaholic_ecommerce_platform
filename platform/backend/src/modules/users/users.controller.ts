import {
  Body,
  Post,
  Get,
  Param,
  UploadedFile,
  Version,
  Delete,
  Query,
  Patch,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtRole } from 'src/modules/auth/jwt/jwt-role';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { UserResponseDto } from './dto/user-response.dto';
import { DefaultUploadFileValidationDecorator } from 'src/core/decorator/default-file.decorator';
import { Auth } from '../auth/decorator/auth.decorator';
import { ApiController } from 'src/core/decorator/default-api.decorator';
import { Pagination } from 'nestjs-typeorm-paginate';
import { AuthUserId } from '../auth/decorator/auth-user-id.decorator';
import { UpdatePasswordDto } from './dto/update-password.dto';

/**
 * Controller for managing user operations.
 */
@ApiController('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  /**
   * Update the information of the authenticated client.
   * @param file The updated image file for the user.
   * @param userData The updated user data.
   * @returns The updated user response DTO.
   */
  @Auth(JwtRole.CLIENT)
  @Version('1.0')
  @Post('self')
  @DefaultUploadFileValidationDecorator({ isOptional: true })
  @ApiOperation({ summary: 'Update authenticated client' })
  async updateSelf(
    @UploadedFile() file: Express.Multer.File,
    @Body() userData: UpdateUserDto,
    @AuthUserId() userId: string,
  ): Promise<UserResponseDto> {
    const updatedUser = { ...userData, imageFile: file };
    return this.usersService.update(userId, updatedUser);
  }

  /**
   * Delete the account of the authenticated client.
   * @param id The ID of the authenticated client.
   */
  @Auth(JwtRole.CLIENT)
  @Version('1.0')
  @Delete('self')
  @ApiOperation({ summary: 'Delete authenticated client account' })
  async deleteSelf(@AuthUserId() userId: string): Promise<string> {
    return await this.usersService.delete(userId);
  }

  /**
   * Update the password of the authenticated user.
   * @param {UpdatePasswordDto} updatePasswordData - The data for updating the password.
   * @returns {Promise<UserResponseDto>} - The updated user response DTO.
   */
  @Auth(JwtRole.CLIENT)
  @Version('1.0')
  @Patch('self/update-password')
  @ApiOperation({ summary: 'Update authenticated client password' })
  async updatePassword(
    @Body() updatePasswordData: UpdatePasswordDto,
    @AuthUserId() userId: string,
  ): Promise<string> {
    return this.usersService.updatePassword(userId, updatePasswordData);
  }

  /**
   * Update the password of a specific user by their ID (Admin only).
   * @param {string} id - The ID of the user to update.
   * @param {UpdatePasswordDto} updatePasswordData - The data for updating the password.
   * @returns {Promise<string>} - The updated user response DTO.
   */
  @Auth(JwtRole.ADMIN)
  @Version('1.0')
  @Patch(':id/update-password')
  async updatePasswordForUser(
    @Param('id') id: string,
    @Body() updatePasswordData: UpdatePasswordDto,
  ): Promise<string> {
    return this.usersService.updatePassword(id, updatePasswordData);
  }

  /**
   * Get a list of all users.
   * @returns A list of user response DTOs.
   */
  @Auth(JwtRole.ADMIN)
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
  @Auth(JwtRole.ADMIN)
  @Version('1.0')
  @Post()
  @DefaultUploadFileValidationDecorator()
  @ApiOperation({ summary: 'Create new user' })
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() userData: CreateUserDto,
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
  @Auth(JwtRole.ADMIN)
  @Version('1.0')
  @Post(':id')
  @DefaultUploadFileValidationDecorator({ isOptional: true })
  @ApiOperation({ summary: 'Update user and profile picture' })
  async update(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
    @Body() userData: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = { ...userData, imageFile: file };
    return this.usersService.update(id, user);
  }

  /**
   * Delete a user by ID.
   * @param id The ID of the user to delete.
   */
  @Auth(JwtRole.ADMIN)
  @Version('1.0')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete user by ID' })
  async delete(@Param('id') id: string): Promise<string> {
    return await this.usersService.delete(id);
  }

  /**
   * Search for users by name.
   * @param name The name to search for.
   * @returns A list of users matching the name.
   */
  @Auth(JwtRole.ADMIN)
  @Version('1.0')
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

  /**
   * Search for users by name and filter by role (ADMIN or CLIENT), and paginate the results.
   * @param {string} name - The search term to filter users by name.
   * @param {JwtRole} role - The role to filter users by role (ADMIN or CLIENT).
   * @param {number} page - The page number for pagination (default is 1).
   * @param {number} limit - The number of items per page (default is 10).
   * @returns {Promise<Pagination<UserResponseDto>>} - A paginated result of UserResponseDto.
   */
  @Auth(JwtRole.ADMIN)
  @Version('1.0')
  @Get('search')
  @ApiOperation({
    summary: 'Search for users by name and filter by role (ADMIN or CLIENT)',
  })
  @ApiQuery({
    name: 'name',
    required: true,
    description: 'Search term for filtering users by name',
  })
  @ApiQuery({
    name: 'role',
    enum: JwtRole,
    required: true,
    description: 'Filter users by role (ADMIN or CLIENT)',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number',
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Items per page',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Filtered and paginated users',
    type: UserResponseDto,
    isArray: true,
  })
  async searchAndPaginateUsers(
    @Query('name') name: string,
    @Query('role') role: JwtRole,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<Pagination<UserResponseDto>> {
    return this.usersService.searchAndPaginateUsers(name, role, page, limit);
  }
}
