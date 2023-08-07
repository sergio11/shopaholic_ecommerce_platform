import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEntity } from './role.entity';
import { Repository } from 'typeorm';
import { CreateRolDto } from './dto/create-role.dto';
import { SupportService } from 'src/core/support.service';
import { InjectMapper } from '@automapper/nestjs';
import { I18nService } from 'nestjs-i18n';
import { Mapper } from '@automapper/core';

@Injectable()
export class RolesService extends SupportService {

    constructor(
        @InjectRepository(RoleEntity) private rolesRepository: Repository<RoleEntity>,
        @InjectMapper() private readonly classMapper: Mapper,
        i18n: I18nService) {
        super(i18n)
    }

    create(rol: CreateRolDto) {
        const newRol = this.rolesRepository.create(rol);
        return this.rolesRepository.save(newRol);
    }

}
