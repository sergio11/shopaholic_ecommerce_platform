import { Controller, UseGuards, Put, Param, Body, Post, Get, Delete, Version } from '@nestjs/common';
import { HasRoles } from '../auth/jwt/has-roles';
import { JwtRole } from '../auth/jwt/jwt-role';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { JwtRolesGuard } from '../auth/jwt/jwt-roles.guard';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AddressResponseDto } from './dto/address-response.dto';

@ApiBearerAuth()
@ApiTags('address')
@Controller('address')
export class AddressController {

    constructor(private addressService: AddressService) {}

    /**
     * Create a new address.
     * @param {CreateAddressDto} address - The address data to create.
     * @returns {AddressResponseDto} The newly created address.
     */
    @HasRoles(JwtRole.ADMIN, JwtRole.CLIENT)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Version('1.0')
    @Post()
    @ApiOperation({ summary: 'Create a new address' })
    @ApiResponse({
        status: 200,
        description: 'A new address created',
        type: AddressResponseDto,
    })
    create(@Body() address: CreateAddressDto) {
        return this.addressService.create(address);
    }
    
    /**
     * Return all addresses that have been registered.
     * @returns {AddressResponseDto[]} A list of registered addresses.
     */
    @HasRoles(JwtRole.ADMIN, JwtRole.CLIENT)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Version('1.0')
    @Get()
    @ApiOperation({ summary: 'Return all addresses that have been registered' })
    @ApiResponse({
        status: 200,
        description: 'A list of registered addresses',
        type: AddressResponseDto,
    })
    findAll() {
        return this.addressService.findAll();
    }
    
    /**
     * Return all addresses that have been registered by a user.
     * @param {string} id_user - The user ID associated with the addresses.
     * @returns {AddressResponseDto[]} A list of addresses registered by the user.
     */
    @HasRoles(JwtRole.ADMIN, JwtRole.CLIENT)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Version('1.0')
    @Get('user/:id_user')
    @ApiOperation({ summary: 'Return all addresses that have been registered by user' })
    @ApiResponse({
        status: 200,
        description: 'A list of addresses registered by user',
        type: AddressResponseDto,
    })
    findByUser(@Param('id_user') id_user: string) {
        return this.addressService.findByUser(id_user);
    }

    /**
     * Update the data of an address.
     * @param {string} id - The ID of the address to update.
     * @param {UpdateAddressDto} address - The updated address data.
     * @returns {AddressResponseDto} The updated address.
     */
    @HasRoles(JwtRole.ADMIN, JwtRole.CLIENT)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Version('1.0')
    @Put(':id')
    @ApiOperation({ summary: 'Allow us to update the data of an address' })
    @ApiResponse({
        status: 200,
        description: 'The address updated by the user',
        type: AddressResponseDto,
    })
    update(@Param('id') id: string, @Body() address: UpdateAddressDto) {
        return this.addressService.update(id, address);
    }
    
    /**
     * Delete an address.
     * @param {string} id - The ID of the address to delete.
     * @returns {AddressResponseDto} The deleted address.
     */
    @HasRoles(JwtRole.ADMIN, JwtRole.CLIENT)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Version('1.0')
    @Delete(':id')
    @ApiOperation({ summary: 'Allow us to delete an address' })
    @ApiResponse({
        status: 200,
        description: 'The address deleted by the user',
        type: AddressResponseDto,
    })
    delete(@Param('id') id: string) {
        return this.addressService.delete(id);
    }
}