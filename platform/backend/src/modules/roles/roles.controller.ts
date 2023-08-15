import { Body, Controller, Delete, HttpStatus, Param, ParseFilePipe, ParseFilePipeBuilder, Post, Put, UploadedFile, UseGuards, UseInterceptors, Version } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { HasRoles } from '../auth/jwt/has-roles';
import { JwtRole } from '../auth/jwt/jwt-role';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { JwtRolesGuard } from '../auth/jwt/jwt-roles.guard';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiBearerAuth()
@ApiTags('roles')
@Controller('roles')
export class RolesController {

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

    constructor(private rolesService: RolesService) {}

    /**
     * Creates a new role with the given information and image file.
     * @param file - The image file associated with the role.
     * @param role - The data to create the new role.
     * @returns The newly created role.
     */
    @HasRoles(JwtRole.ADMIN)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Version('1.0')
    @Post()
    @UseInterceptors(FileInterceptor('imageFile'))
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: 'Create new role' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    create(
        @UploadedFile(RolesController.parseFilePipeBuilder(true)) file: Express.Multer.File,
        @Body() role: CreateRoleDto
    ) {
        return this.rolesService.create(file, role);
    }

    /**
     * Updates an existing role with the given information and image file.
     * @param file - The new image file associated with the role.
     * @param id - The ID of the role to update.
     * @param role - The updated data for the role.
     * @returns The updated role.
     */
    @HasRoles(JwtRole.ADMIN)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Version('1.0')
    @Post(':id')
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: 'Update role by ID' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @UseInterceptors(FileInterceptor('imageFile'))
    update(
        @UploadedFile(RolesController.parseFilePipeBuilder(false)) file: Express.Multer.File,
        @Param('id') id: string, 
        @Body() role: UpdateRoleDto
    ) {
        return this.rolesService.update(id, role, file);
    }

    /**
     * Deletes a role with the specified ID.
     * @param id - The ID of the role to delete.
     */
    @HasRoles(JwtRole.ADMIN)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Version('1.0')
    @Delete(':id')
    @ApiOperation({ summary: 'Delete role by ID' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    delete(@Param('id') id: string) {
        return this.rolesService.delete(id);
    }
}