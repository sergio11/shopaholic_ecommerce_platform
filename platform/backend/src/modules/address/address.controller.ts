import { Put, Param, Body, Post, Get, Delete, Version } from '@nestjs/common';
import { JwtRole } from '../auth/jwt/jwt-role';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AddressResponseDto } from './dto/address-response.dto';
import { Auth } from '../auth/decorator/auth.decorator';
import { ApiController } from 'src/core/decorator/default-api.decorator';

@ApiController('address')
export class AddressController {

    constructor(private addressService: AddressService) {}

    /**
     * Create a new address.
     * @param {CreateAddressDto} address - The address data to create.
     * @returns {Promise<AddressResponseDto>} The newly created address.
     */
    @Auth(JwtRole.ADMIN, JwtRole.CLIENT)
    @Version('1.0')
    @Post()
    @ApiOperation({ summary: 'Create a new address' })
    @ApiResponse({
        status: 200,
        description: 'A new address created',
        type: AddressResponseDto,
    })
    async create(@Body() address: CreateAddressDto): Promise<AddressResponseDto> {
        return this.addressService.create(address);
    }
    
    /**
     * Return all addresses that have been registered.
     * @returns {Promise<AddressResponseDto[]>} A list of registered addresses.
     */
    @Auth(JwtRole.ADMIN, JwtRole.CLIENT)
    @Version('1.0')
    @Get()
    @ApiOperation({ summary: 'Return all addresses that have been registered' })
    @ApiResponse({
        status: 200,
        description: 'A list of registered addresses',
        type: AddressResponseDto,
    })
    async findAll(): Promise<AddressResponseDto[]> {
        return this.addressService.findAll();
    }
    
    /**
     * Return all addresses that have been registered by a user.
     * @param {string} id_user - The user ID associated with the addresses.
     * @returns {Promise<AddressResponseDto[]>} A list of addresses registered by the user.
     */
    @Auth(JwtRole.ADMIN, JwtRole.CLIENT)
    @Version('1.0')
    @Get('user/:id_user')
    @ApiOperation({ summary: 'Return all addresses that have been registered by user' })
    @ApiResponse({
        status: 200,
        description: 'A list of addresses registered by user',
        type: AddressResponseDto,
    })
    async findByUser(@Param('id_user') id_user: string): Promise<AddressResponseDto[]> {
        return this.addressService.findByUser(id_user);
    }

    /**
     * Update the data of an address.
     * @param {string} id - The ID of the address to update.
     * @param {UpdateAddressDto} address - The updated address data.
     * @returns {Promise<AddressResponseDto>} The updated address.
     */
    @Auth(JwtRole.ADMIN, JwtRole.CLIENT)
    @Version('1.0')
    @Put(':id')
    @ApiOperation({ summary: 'Allow us to update the data of an address' })
    @ApiResponse({
        status: 200,
        description: 'The address updated by the user',
        type: AddressResponseDto,
    })
    async update(@Param('id') id: string, @Body() address: UpdateAddressDto): Promise<AddressResponseDto> {
        return this.addressService.update(id, address);
    }
    
    /**
     * Delete an address.
     * @param {string} id - The ID of the address to delete.
     * @returns {Promise<void>} The deleted address.
     */
    @Auth(JwtRole.ADMIN, JwtRole.CLIENT)
    @Version('1.0')
    @Delete(':id')
    @ApiOperation({ summary: 'Allow us to delete an address' })
    @ApiResponse({
        status: 200,
        description: 'The address deleted by the user'
    })
    async delete(@Param('id') id: string): Promise<string> {
        return this.addressService.delete(id);
    }
}