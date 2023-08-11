import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Mapper, createMap, forMember, mapFrom } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { RoleEntity } from './role.entity';
import { RoleResponseDto } from './dto/role-response.dto';

@Injectable()
export class RoleProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }

    override get profile() {
        return (mapper) => {
            createMap(
                mapper, 
                RoleEntity, 
                RoleResponseDto,
                forMember(
                    (destination) => destination.id,
                    mapFrom((source) => source.id.toString())
                )
            );
        };
    }
}