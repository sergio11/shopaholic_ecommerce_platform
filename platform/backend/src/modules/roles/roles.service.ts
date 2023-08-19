import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEntity } from './role.entity';
import { Repository } from 'typeorm';
import { SupportService } from 'src/core/support.service';
import { I18nService } from 'nestjs-i18n';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleResponseDto } from './dto/role-response.dto';
import { RoleMapper } from './role.mapper';
import { StorageMixin } from 'src/modules/storage/mixin/storage.mixin';

@Injectable()
export class RolesService extends SupportService {

    constructor(
        @InjectRepository(RoleEntity) private rolesRepository: Repository<RoleEntity>,
        private readonly mapper: RoleMapper,
        private readonly fileSavingMixin: StorageMixin,
        i18n: I18nService
    ) {
        super(i18n);
    }

    /**
     * Creates a new role with the given information and image file.
     * @param role - The data to create the new role.
     * @returns The newly created role.
     */
    async create(createRoleDto: CreateRoleDto): Promise<RoleResponseDto> {
        createRoleDto.image = await this.fileSavingMixin.saveImageFile(createRoleDto.imageFile);
        const newRole = this.mapper.mapCreateRoleDtoToEntity(createRoleDto);
        const savedRole = await this.rolesRepository.save(newRole);
        return this.mapper.mapRoleToResponseDto(savedRole);
    }

    /**
     * Retrieves all roles.
     * @returns A list of all roles.
     */
    async findAll(): Promise<RoleResponseDto[]> {
        const roles = await this.rolesRepository.find();
        return this.mapper.mapRolesToResponseDtos(roles);
    }

    /**
     * Updates an existing role with the given information and image file.
     * @param id - The ID of the role to update.
     * @param role - The updated data for the role.
     * @returns The updated role.
     */
    async update(id: string, updateRoleDto: UpdateRoleDto): Promise<RoleResponseDto> {
        const roleToUpdate = await this.findRole(id);
        updateRoleDto.image = await this.fileSavingMixin.saveImageFile(updateRoleDto.imageFile, roleToUpdate.image);
        const updatedRole = this.mapper.mapUpdateRoleDtoToEntity(updateRoleDto, roleToUpdate);
        const savedRole = await this.rolesRepository.save(updatedRole);
        return this.mapper.mapRoleToResponseDto(savedRole);
    }

    /**
     * Deletes a role with the specified ID.
     * @param id - The ID of the role to delete.
     */
    async delete(id: string): Promise<string> {
        const roleToDelete = await this.findRole(id);
        await this.fileSavingMixin.removeImageFile(roleToDelete.image);
        await this.rolesRepository.remove(roleToDelete);
        return this.resolveString("ROLE_DELETED_SUCCESSFULLY");
    }

    /**
     * Finds a role by its ID.
     * @param id - The ID of the role to find.
     * @returns The found role entity.
     * @throws {NotFoundException} if the role is not found.
     */
    private async findRole(id: string) {
        const roleFound = await this.rolesRepository.findOneBy({ id: id });
        if (!roleFound) {
            this.throwNotFoundException("ROLE_NOT_FOUND");
        }
        return roleFound;
    }
}