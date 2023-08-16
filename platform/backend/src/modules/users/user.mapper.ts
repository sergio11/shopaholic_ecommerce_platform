import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { UserEntity } from './user.entity';
import { UserResponseDto } from './dto/user-response.dto';
import { RoleMapper } from '../roles/role.mapper';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserMapper {
  constructor(private readonly roleMapper: RoleMapper) {}

  mapUserToResponseDto(user: UserEntity): UserResponseDto {
    const userDto = plainToClass(UserResponseDto, user, { excludeExtraneousValues: true });
    userDto.roles = this.roleMapper.mapRolesToResponseDtos(user.roles);
    return userDto;
  }

  mapUsersToResponseDtos(users: UserEntity[]): UserResponseDto[] {
    return users.map(user => this.mapUserToResponseDto(user));
  }

  mapCreateUserDtoToEntity(createUserDto: CreateUserDto): UserEntity {
    return plainToClass(UserEntity, createUserDto);
  }

  mapUpdateUserDtoToEntity(updateUserDto: UpdateUserDto, userEntity: UserEntity): UserEntity {
    return Object.assign(userEntity, plainToClass(UserEntity, updateUserDto));
  }
}