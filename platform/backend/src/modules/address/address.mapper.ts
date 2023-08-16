import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { AddressEntity } from './address.entity';
import { AddressResponseDto } from './dto/address-response.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { CreateAddressDto } from './dto/create-address.dto';

@Injectable()
export class AddressMapper {
    mapAddressToResponseDto(address: AddressEntity): AddressResponseDto {
        return plainToClass(AddressResponseDto, address, { excludeExtraneousValues: true });
    }

    mapAddressesToResponseDtos(addresses: AddressEntity[]): AddressResponseDto[] {
        return addresses.map(address => this.mapAddressToResponseDto(address));
    }

    mapCreateAddressDtoToEntity(createAddressDto: CreateAddressDto): AddressEntity {
        return plainToClass(AddressEntity, createAddressDto);
    }

    mapUpdateAddressDtoToEntity(updateAddressDto: UpdateAddressDto): AddressEntity {
        return plainToClass(AddressEntity, updateAddressDto);
    }
}
