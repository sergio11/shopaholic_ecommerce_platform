import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Mapper, createMap, forMember, mapFrom } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { UserEntity } from './user.entity';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UserProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }

    override get profile() {
        return (mapper) => {
            createMap(
                mapper,
                UserEntity,
                UserResponseDto,
                forMember(
                    (destination) => destination.roles,
                    mapFrom((source) => source.roles)
                )
            );
        };
    }
}