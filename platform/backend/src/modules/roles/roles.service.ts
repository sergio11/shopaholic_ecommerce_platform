import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEntity } from './role.entity';
import { Repository } from 'typeorm';
import { SupportService } from 'src/core/support.service';
import { InjectMapper } from '@automapper/nestjs';
import { I18nService } from 'nestjs-i18n';
import { Mapper } from '@automapper/core';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
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

    async update(id: string, role: UpdateRoleDto): Promise<RoleResponseDto> {
        const roleToUpdate = await this.rolesRepository.findOneBy({ id });
        if (!roleToUpdate) {
            this.throwNotFoundException(`Role with ID ${id} not found`);
        }
        
        const updatedRole = Object.assign(roleToUpdate, role);
        const savedRole = await this.rolesRepository.save(updatedRole);
        return this.mapper.map(savedRole, RoleResponseDto, RoleEntity);
    }

    async delete(id: string): Promise<void> {
        const roleToDelete = await this.rolesRepository.findOneBy({ id });
        if (!roleToDelete) {
            this.throwNotFoundException(`Role with ID ${id} not found`);
        }
        await this.rolesRepository.remove(roleToDelete);
    }
}
