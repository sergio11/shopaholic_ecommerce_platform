import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { AddressEntity } from './address.entity';
import { AddressResponseDto } from './dto/address-response.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { CreateAddressDto } from './dto/create-address.dto';
import { UserMapper } from '../users/user.mapper';

@Injectable()
export class AddressMapper {

  /**
   * Creates an instance of AddressMapper.
   * @param userMapper - An instance of UserMapper.
   */
  constructor(
    private readonly userMapper: UserMapper
  ) {}

  async mapAddressToResponseDto(address: AddressEntity): Promise<AddressResponseDto> {
    const addressDTO =  plainToClass(AddressResponseDto, address, {
      excludeExtraneousValues: true,
    });

    if(address.user) {
      addressDTO.user = await this.userMapper.mapUserToResponseDto(address.user);
    }

    return addressDTO;
  }

  async mapAddressesToResponseDtos(addresses: AddressEntity[]): Promise<AddressResponseDto[]> {
    const responseDtos: AddressResponseDto[] = [];
    for (const address of addresses) {
      const addressResponseDto = await this.mapAddressToResponseDto(address);
      responseDtos.push(addressResponseDto);
    }
    return responseDtos;
  }

  mapCreateAddressDtoToEntity(
    createAddressDto: CreateAddressDto,
  ): AddressEntity {
    return plainToClass(AddressEntity, createAddressDto);
  }

  mapUpdateAddressDtoToEntity(
    updateAddressDto: UpdateAddressDto,
  ): AddressEntity {
    return plainToClass(AddressEntity, updateAddressDto);
  }
}
