import { Controller, UseGuards, Put, Param, Body, ParseIntPipe, Post, Get, Delete } from '@nestjs/common';
import { HasRoles } from '../auth/jwt/has-roles';
import { JwtRole } from '../auth/jwt/jwt-role';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { JwtRolesGuard } from '../auth/jwt/jwt-roles.guard';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AddressEntity } from './address.entity';

@ApiBearerAuth()
@ApiTags('address')
@Controller('address')
export class AddressController {

    constructor(private addressService: AddressService) {}

    @HasRoles(JwtRole.ADMIN, JwtRole.CLIENT)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Post()
    @ApiOperation({ summary: 'Create a new address' })
    @ApiResponse({
        status: 200,
        description: 'A new address created',
        type: AddressEntity,
    })
    create(@Body() address: CreateAddressDto) {
        return this.addressService.create(address);
    }
    
    @HasRoles(JwtRole.ADMIN, JwtRole.CLIENT)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Get()
    findAll() {
        return this.addressService.findAll();
    }
    
    @HasRoles(JwtRole.ADMIN, JwtRole.CLIENT)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Get('user/:id_user')
    findByUser(@Param('id_user', ParseIntPipe) id_user: number) {
        return this.addressService.findByUser(id_user);
    }

    @HasRoles(JwtRole.ADMIN, JwtRole.CLIENT)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Put(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() address: UpdateAddressDto) {
        return this.addressService.update(id, address);
    }
    
    @HasRoles(JwtRole.ADMIN, JwtRole.CLIENT)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.addressService.delete(id);
    }

}
