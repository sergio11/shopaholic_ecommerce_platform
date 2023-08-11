import { Injectable } from '@nestjs/common';
import { Mapper, createMap, forMember, mapFrom } from '@automapper/core';
import { AddressEntity } from './address.entity';
import { AddressResponseDto } from './dto/address-response.dto';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';

@Injectable()
export class AddressProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }

    override get profile() {
        return (mapper) => {
            createMap(
                mapper, 
                AddressEntity, 
                AddressResponseDto,
                forMember(dest => dest.id, mapFrom(src => src.id)),
                forMember(dest => dest.address, mapFrom(src => src.address)),
                forMember(dest => dest.neighborhood, mapFrom(src => src.neighborhood)),
                forMember(dest => dest.idUser, mapFrom(src => src.idUser)));
        };
    }
}
