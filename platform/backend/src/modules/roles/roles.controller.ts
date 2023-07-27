import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRolDto } from './dto/create-rol.dto';
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

    @HasRoles(JwtRole.CLIENT)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Post()
    @ApiOperation({ summary: 'Create new rol' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    create(@Body() rol: CreateRolDto) {
        return this.rolesService.create(rol);
    }

}
