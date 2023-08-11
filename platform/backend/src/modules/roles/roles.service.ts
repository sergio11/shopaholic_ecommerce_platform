import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEntity } from './role.entity';
import { Repository } from 'typeorm';
import { SupportService } from 'src/core/support.service';
import { InjectMapper } from '@automapper/nestjs';
import { I18nService } from 'nestjs-i18n';
import { Mapper } from '@automapper/core';
import { CreateRoleDto } from './dto/create-role.dto';
import { RoleResponseDto } from './dto/role-response.dto';

@Injectable()
export class RolesService extends SupportService {

    constructor(
        @InjectRepository(RoleEntity) private rolesRepository: Repository<RoleEntity>,
        @InjectMapper() private readonly mapper: Mapper,
        i18n: I18nService
    ) {
        super(i18n);
    }

    async create(role: CreateRoleDto): Promise<RoleResponseDto> {
        const newRole = this.rolesRepository.create(role);
        const savedRole = await this.rolesRepository.save(newRole);
        return this.mapper.map(savedRole, RoleResponseDto, RoleEntity);
    }

    async findAll(): Promise<RoleResponseDto[]> {
        const roles = await this.rolesRepository.find();
        return this.mapper.mapArray(roles, RoleEntity, RoleResponseDto);
    }
}
