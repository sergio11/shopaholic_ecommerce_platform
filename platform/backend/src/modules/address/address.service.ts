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

@Injectable()
export class AddressService extends SupportService {
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
    i18n: I18nService,
  ) {
    super(i18n);
  }

  /**
   * Create a new address.
   * @param {CreateAddressDto} address - The address data to create.
   * @returns {Promise<AddressResponseDto>} The newly created address.
   */
  async create(address: CreateAddressDto): Promise<AddressResponseDto> {
    const userFound = await this.findUser(address.idUser);
    const newAddress = this.mapper.mapCreateAddressDtoToEntity(address);
    newAddress.user = userFound;
    const savedAddress = await this.addressRepository.save(newAddress);
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
    const addresses = await this.addressRepository.find({
      where: { idUser: id },
    });
    return this.mapper.mapAddressesToResponseDtos(addresses);
  }

  /**
   * Update the data of an address.
   * @param {string} id - The ID of the address to update.
   * @param {UpdateAddressDto} address - The updated address data.
   * @returns {Promise<AddressResponseDto>} The updated address.
   */
  async update(
    id: string,
    address: UpdateAddressDto,
  ): Promise<AddressResponseDto> {
    const addressFound = await this.findAddress(id);
    const addressToUpdate = this.mapper.mapUpdateAddressDtoToEntity(address);
    const updatedAddress = Object.assign(addressFound, addressToUpdate);
    const savedAddress = await this.addressRepository.save(updatedAddress);
    return this.mapper.mapAddressToResponseDto(savedAddress);
  }

  /**
   * Delete an address by its ID.
   * @param {string} id - The ID of the address to delete.
   * @returns {Promise<string>}
   */
  async delete(id: string): Promise<string> {
    await this.findAddress(id);
    await this.addressRepository.delete(id);
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
    console.log(`findUser id: ${id} - USER_NOT_FOUND`)
    return this.findEntityById(id, this.userRepository, 'USER_NOT_FOUND');
  }
}
