import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddressEntity } from './address.entity';
import { SupportService } from 'src/core/support.service';
import { I18nService } from 'nestjs-i18n';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { AddressResponseDto } from './dto/address-response.dto';
import { AddressMapper } from './address.mapper';
import { UserEntity } from '../users/user.entity';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class AddressService extends SupportService {

  private readonly ADDRESSES_BY_USER_CACHE_KEY = 'cache:address:user:';
  private readonly DEFAULT_TTL_IN_SECONDS = 1200;
  /**
   *
   * @param addressRepository
   * @param userRepository
   * @param mapper
   * @param i18n
   */
  constructor(
    @InjectRepository(AddressEntity)
    private addressRepository: Repository<AddressEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private readonly mapper: AddressMapper,
    private readonly cacheService: CacheService<AddressResponseDto[]>,
    i18n: I18nService,
  ) {
    super(i18n);
  }

  /**
   * Create a new address for the authenticated user.
   * @param {CreateAddressDto} address - The address data to create.
   * @param {string} userId - The ID of the authenticated user.
   * @returns {Promise<AddressResponseDto>} The newly created address.
   */
  async create(address: CreateAddressDto, userId: string): Promise<AddressResponseDto> {
    const userFound = await this.findUser(userId);
    const newAddress = this.mapper.mapCreateAddressDtoToEntity(address);
    newAddress.user = userFound;
    const savedAddress = await this.addressRepository.save(newAddress);
    await this.cacheService.delete(this.ADDRESSES_BY_USER_CACHE_KEY + userId)
    return this.mapper.mapAddressToResponseDto(savedAddress);
  }

  /**
   * Find and return all registered addresses.
   * @returns {Promise<AddressResponseDto[]>} A list of registered addresses.
   */
  async findAll(): Promise<AddressResponseDto[]> {
    const addresses = await this.addressRepository.find();
    return this.mapper.mapAddressesToResponseDtos(addresses);
  }

  /**
   * Find and return all addresses registered by a user.
   * @param {string} id - The user ID associated with the addresses.
   * @returns {Promise<AddressResponseDto[]>} A list of addresses registered by the user.
   */
  async findByUser(id: string): Promise<AddressResponseDto[]> {
    var addressesByUser = [];
    const cachedAddresses = await this.cacheService.get(this.ADDRESSES_BY_USER_CACHE_KEY + id);
    if (cachedAddresses) {
      addressesByUser = cachedAddresses;
    } else {
      const addresses = await this.addressRepository.find({
        where: { idUser: id },
      });
      console.log(`findByUser - ${id} - address count: ${addresses.length}`)
      addressesByUser = this.mapper.mapAddressesToResponseDtos(addresses);
      await this.cacheService.set(
        this.ADDRESSES_BY_USER_CACHE_KEY + id,
        addressesByUser,
        this.DEFAULT_TTL_IN_SECONDS,
      );
    }
    return addressesByUser;
  }

  /**
   * Update the data of an address.
   * @param {string} id - The ID of the address to update.
   * @param {UpdateAddressDto} address - The updated address data.
   * @param {string} userId - The authenticated user id
   * @returns {Promise<AddressResponseDto>} The updated address.
   */
  async update(
    id: string,
    address: UpdateAddressDto,
    userId: string,
  ): Promise<AddressResponseDto> {
    const addressFound = await this.findAddress(id);
    const userFound = await this.findUser(userId);
    if((!userFound.roles || !userFound.roles.some(role => role.name === 'ADMIN')) && addressFound.idUser != userId) {
      this.throwForbiddenException('OPERATION_NOT_ALLOWED');
    }
    const addressToUpdate = this.mapper.mapUpdateAddressDtoToEntity(address);
    const updatedAddress = Object.assign(addressFound, addressToUpdate);
    const savedAddress = await this.addressRepository.save(updatedAddress);
    await this.cacheService.delete(this.ADDRESSES_BY_USER_CACHE_KEY + addressFound.idUser)
    return this.mapper.mapAddressToResponseDto(savedAddress);
  }

  /**
   * Delete an address by its ID.
   * @param {string} id - The ID of the address to delete.
   * @param {string} userId - The authenticated user id
   * @returns {Promise<string>}
   */
  async delete(
    id: string, 
    userId: string
  ): Promise<string> {
    const addressFound = await this.findAddress(id);
    const userFound = await this.findUser(userId);
    if(!userFound.roles.some(role => role.name === 'ADMIN') && addressFound.idUser != userId) {
      this.throwForbiddenException('OPERATION_NOT_ALLOWED');
    }
    await this.addressRepository.delete(id);
    await this.cacheService.delete(this.ADDRESSES_BY_USER_CACHE_KEY + addressFound.idUser)
    return this.resolveString('ADDRESS_DELETED_SUCCESSFULLY');
  }

  /**
   * Find an address by its ID.
   * @param {string} id - The ID of the address to find.
   * @returns {Promise<AddressEntity>} The found address entity.
   * @throws {NotFoundException} If the address is not found.
   */
  private async findAddress(id: string): Promise<AddressEntity> {
    return this.findEntityById(id, this.addressRepository, 'ADDRESS_NOT_FOUND');
  }

  private async findUser(id: string): Promise<UserEntity> {
    console.log(`findUser id: ${id}`)
    return this.findEntityById(id, this.userRepository, 'USER_NOT_FOUND', ['roles']);
  }
}
