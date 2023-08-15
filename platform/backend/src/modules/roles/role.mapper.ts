import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { RoleEntity } from './role.entity';
import { RoleResponseDto } from './dto/role-response.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RoleMapper {
  mapRoleToResponseDto(role: RoleEntity): RoleResponseDto {
    return plainToClass(RoleResponseDto, role, { excludeExtraneousValues: true });
  }

  mapRolesToResponseDtos(roles: RoleEntity[]): RoleResponseDto[] {
    return roles.map(role => this.mapRoleToResponseDto(role));
  }

  mapCreateRoleDtoToEntity(dto: CreateRoleDto): RoleEntity {
    return plainToClass(RoleEntity, dto, { excludeExtraneousValues: true });
  }

  mapUpdateRoleDtoToEntity(dto: UpdateRoleDto, entity: RoleEntity): RoleEntity {
    return Object.assign(entity, plainToClass(RoleEntity, dto, { excludeExtraneousValues: true }));
  }
}