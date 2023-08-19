import { Body, Delete, Param, Post, UploadedFile, Version } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { JwtRole } from '../auth/jwt/jwt-role';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RoleResponseDto } from './dto/role-response.dto';
import { DefaultUploadFileValidationDecorator } from 'src/core/decorator/default-file.decorator';
import { Auth } from '../auth/decorator/auth.decorator';
import { ApiController } from 'src/core/decorator/default-api.decorator';


@ApiController('roles')
export class RolesController {

    constructor(private rolesService: RolesService) {}

    /**
     * Creates a new role with the given information and image file.
     * @param file - The image file associated with the role.
     * @param role - The data to create the new role.
     * @returns The newly created role.
     */
    @Auth(JwtRole.ADMIN)
    @Version('1.0')
    @Post()
    @DefaultUploadFileValidationDecorator()
    @ApiOperation({ summary: 'Create new role' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async create(
        @UploadedFile() file: Express.Multer.File,
        @Body() roleData: CreateRoleDto
    ): Promise<RoleResponseDto> {
        const role = { ...roleData, imageFile: file};
        return this.rolesService.create(role);
    }

    /**
     * Updates an existing role with the given information and image file.
     * @param file - The new image file associated with the role.
     * @param id - The ID of the role to update.
     * @param role - The updated data for the role.
     * @returns The updated role.
     */
    @Auth(JwtRole.ADMIN)
    @Version('1.0')
    @Post(':id')
    @DefaultUploadFileValidationDecorator({ isOptional: true })
    @ApiOperation({ summary: 'Update role by ID' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async update(
        @UploadedFile() file: Express.Multer.File,
        @Param('id') id: string, 
        @Body() roleData: UpdateRoleDto
    ): Promise<RoleResponseDto> {
        const role = { ...roleData, imageFile: file};
        return this.rolesService.update(id, role);
    }

    /**
     * Deletes a role with the specified ID.
     * @param id - The ID of the role to delete.
     */
    @Auth(JwtRole.ADMIN)
    @Version('1.0')
    @Delete(':id')
    @ApiOperation({ summary: 'Delete role by ID' })
    async delete(@Param('id') id: string): Promise<string> {
        return this.rolesService.delete(id);
    }
}