import { Put, Param, Body, Post, Get, Delete, Version } from '@nestjs/common';
import { JwtRole } from '../auth/jwt/jwt-role';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AddressResponseDto } from './dto/address-response.dto';
import { Auth } from '../auth/decorator/auth.decorator';
import { ApiController } from 'src/core/decorator/default-api.decorator';
import { AuthUserId } from '../auth/decorator/auth-user-id.decorator';

@ApiController('address')
export class AddressController {
  constructor(private addressService: AddressService) {}

  /**
   * Create a new address for the currently authenticated user.
   * @param {CreateAddressDto} address - The address data to create.
   * @param {string} userId - ID of the authenticated user.
   * @returns {Promise<AddressResponseDto>} The newly created address.
   */
  @Auth(JwtRole.ADMIN, JwtRole.CLIENT)
  @Version('1.0')
  @Post()
  @ApiOperation({ summary: 'Create a new address for the currently authenticated user.' })
  @ApiResponse({
    status: 200,
    description: 'A new address created',
    type: AddressResponseDto,
  })
  async create(
    @Body() address: CreateAddressDto,
    @AuthUserId() userId: string,
  ): Promise<AddressResponseDto> {
    return this.addressService.create(address, userId);
  }

  /**
   * Return all addresses that have been registered.
   * @returns {Promise<AddressResponseDto[]>} A list of registered addresses.
   */
  @Auth(JwtRole.ADMIN)
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
   * Return all addresses of the currently authenticated user.
   * @returns {Promise<AddressResponseDto[]>} A list of addresses of the authenticated user.
   */
  @Auth(JwtRole.ADMIN, JwtRole.CLIENT)
  @Version('1.0')
  @Get('user/')
  @ApiOperation({ summary: 'Return all addresses of the currently authenticated user.' })
  @ApiResponse({
    status: 200,
    description: 'All addresses of the currently authenticated user',
    type: AddressResponseDto,
  })
  async findAllCurrentUserAddresses(
    @AuthUserId() userId: string,
  ): Promise<AddressResponseDto[]> {
    console.log(`findAllCurrentUserAddresses - userId: ${userId}`)
    return this.addressService.findByUser(userId);
  }

  /**
   * Return all addresses that have been registered by a user.
   * @param {string} id_user - The user ID associated with the addresses.
   * @returns {Promise<AddressResponseDto[]>} A list of addresses registered by the user.
   */
  @Auth(JwtRole.ADMIN)
  @Version('1.0')
  @Get('user/:id_user')
  @ApiOperation({
    summary: 'Return all addresses that have been registered by user',
  })
  @ApiResponse({
    status: 200,
    description: 'A list of addresses registered by user',
    type: AddressResponseDto,
  })
  async findByUser(
    @Param('id_user') id_user: string,
  ): Promise<AddressResponseDto[]> {
    return this.addressService.findByUser(id_user);
  }

  /**
   * Update the data of an address.
   * @param {string} id - The ID of the address to update.
   * @param {UpdateAddressDto} address - The updated address data.
   * @param {string} userId - User authenticated id.
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
  async update(
    @Param('id') id: string,
    @Body() address: UpdateAddressDto,
    @AuthUserId() userId: string,
  ): Promise<AddressResponseDto> {
    return this.addressService.update(id, address, userId);
  }

  /**
   * Delete an address.
   * @param {string} id - The ID of the address to delete.
   * @param {string} userId - User authenticated id.
   * @returns {Promise<void>} The deleted address.
   */
  @Auth(JwtRole.ADMIN, JwtRole.CLIENT)
  @Version('1.0')
  @Delete(':id')
  @ApiOperation({ summary: 'Allow us to delete an address' })
  @ApiResponse({
    status: 200,
    description: 'The address deleted by the user',
  })
  async delete(
    @Param('id') id: string,
    @AuthUserId() userId: string
  ): Promise<string> {
    return this.addressService.delete(id, userId);
  }
}
