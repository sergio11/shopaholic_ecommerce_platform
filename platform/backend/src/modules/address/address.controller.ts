import { Controller, UseGuards, Put, Param, Body, Post, Get, Delete, Version } from '@nestjs/common';
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
    @Version('1.0')
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
    @Version('1.0')
    @Get()
    @ApiOperation({ summary: 'Return all address have been registered' })
    @ApiResponse({
        status: 200,
        description: 'A list of address created',
        type: AddressEntity,
    })
    findAll() {
        return this.addressService.findAll();
    }
    
    @HasRoles(JwtRole.ADMIN, JwtRole.CLIENT)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Version('1.0')
    @Get('user/:id_user')
    @ApiOperation({ summary: 'Return all address have been registered by user' })
    @ApiResponse({
        status: 200,
        description: 'A list of address created by user',
        type: AddressEntity,
    })
    findByUser(@Param('id_user') id_user: string) {
        return this.addressService.findByUser(id_user);
    }

    @HasRoles(JwtRole.ADMIN, JwtRole.CLIENT)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Version('1.0')
    @Put(':id')
    @ApiOperation({ summary: 'Allow us to update the data of address' })
    @ApiResponse({
        status: 200,
        description: 'The address updated by the user',
        type: AddressEntity,
    })
    update(@Param('id') id: string, @Body() address: UpdateAddressDto) {
        return this.addressService.update(id, address);
    }
    
    @HasRoles(JwtRole.ADMIN, JwtRole.CLIENT)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Version('1.0')
    @Delete(':id')
    @ApiOperation({ summary: 'Allow us to delete an address' })
    @ApiResponse({
        status: 200,
        description: 'The address deleted by the user',
        type: AddressEntity,
    })
    delete(@Param('id') id: string) {
        return this.addressService.delete(id);
    }

}
