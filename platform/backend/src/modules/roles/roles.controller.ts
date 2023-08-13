import { Body, Controller, Delete, Param, Post, Put, UseGuards, Version } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { HasRoles } from '../auth/jwt/has-roles';
import { JwtRole } from '../auth/jwt/jwt-role';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { JwtRolesGuard } from '../auth/jwt/jwt-roles.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('roles')
@Controller('roles')
export class RolesController {

    constructor(private rolesService: RolesService) {}

    @HasRoles(JwtRole.ADMIN)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Version('1.0')
    @Post()
    @ApiOperation({ summary: 'Create new role' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    create(@Body() role: CreateRoleDto) {
        return this.rolesService.create(role);
    }

    @HasRoles(JwtRole.ADMIN)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Version('1.0')
    @Put(':id')
    @ApiOperation({ summary: 'Update role by ID' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    update(@Param('id') id: string, @Body() role: UpdateRoleDto) {
        return this.rolesService.update(id, role);
    }

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
