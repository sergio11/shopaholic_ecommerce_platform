import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Mapper, createMap } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { RoleEntity } from './role.entity';
import { RoleDto } from './dto/role.dto';

@Injectable()
export class RoleProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }

    override get profile() {
        return (mapper) => {
            createMap(mapper, RoleEntity, RoleDto);
        };
    }
}