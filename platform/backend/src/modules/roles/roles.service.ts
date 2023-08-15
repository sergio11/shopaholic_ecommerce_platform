import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEntity } from './role.entity';
import { Repository } from 'typeorm';
import { SupportService } from 'src/core/support.service';
import { I18nService } from 'nestjs-i18n';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleResponseDto } from './dto/role-response.dto';
import { IStorageService, STORAGE_SERVICE } from '../storage/storage.service';
import { RoleMapper } from './role.mapper';

@Injectable()
export class RolesService extends SupportService {

    constructor(
        @InjectRepository(RoleEntity) private rolesRepository: Repository<RoleEntity>,
        private readonly mapper: RoleMapper,
        @Inject(STORAGE_SERVICE)
        storageService: IStorageService,
        i18n: I18nService
    ) {
        super(i18n, storageService);
    }

    /**
     * Creates a new role with the given information and image file.
     * @param file - The image file associated with the role.
     * @param role - The data to create the new role.
     * @returns The newly created role.
     */
    async create(file: Express.Multer.File, role: CreateRoleDto): Promise<RoleResponseDto> {
        role.image = await this.saveFileAndGetImageDto(file);
        const newRole = this.mapper.mapCreateRoleDtoToEntity(role);
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
     * @param file - The new image file associated with the role.
     * @returns The updated role.
     */
    async update(id: string, role: UpdateRoleDto, file: Express.Multer.File): Promise<RoleResponseDto> {
        const roleToUpdate = await this.findRole(id);
        const updatedRole = this.mapper.mapUpdateRoleDtoToEntity(role, roleToUpdate);
        const savedRole = await this.rolesRepository.save(updatedRole);
        return this.mapper.mapRoleToResponseDto(savedRole);
    }

    /**
     * Deletes a role with the specified ID.
     * @param id - The ID of the role to delete.
     */
    async delete(id: string): Promise<void> {
        const roleToDelete = await this.findRole(id);
        await this.rolesRepository.remove(roleToDelete);
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