import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { UserEntity } from './user.entity';
import { UserResponseDto } from './dto/user-response.dto';
import { RoleMapper } from '../roles/role.mapper';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

/**
 * Mapper service for converting UserEntity and DTO objects.
 */
@Injectable()
export class UserMapper {
  /**
   * Creates an instance of UserMapper.
   * @param roleMapper - An instance of RoleMapper.
   */
  constructor(
    private readonly roleMapper: RoleMapper,
  ) {}

  /**
   * Maps a UserEntity object to a UserResponseDto object.
   * @param {UserEntity} user - The UserEntity to be mapped.
   * @returns {UserResponseDto} The mapped UserResponseDto object.
   */
  mapUserToResponseDto(user: UserEntity): UserResponseDto {
    const userDto = plainToClass(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
    userDto.roles = this.roleMapper.mapRolesToResponseDtos(user.roles);
    return userDto;
  }

  /**
   * Maps an array of UserEntity objects to an array of UserResponseDto objects.
   * @param {UserEntity[]} users - The array of UserEntity objects to be mapped.
   * @returns {UserResponseDto[]} The mapped array of UserResponseDto objects.
   */
  mapUsersToResponseDtos(users: UserEntity[]): UserResponseDto[] {
    return users.map((user) => this.mapUserToResponseDto(user));
  }

  /**
   * Maps a CreateUserDto object to a UserEntity object.
   * @param {CreateUserDto} createUserDto - The CreateUserDto to be mapped.
   * @returns {UserEntity} The mapped UserEntity object.
   */
  mapCreateUserDtoToEntity(createUserDto: CreateUserDto): UserEntity {
    return plainToClass(UserEntity, createUserDto);
  }

  /**
   * Maps an UpdateUserDto object to a UserEntity object.
   * @param {UpdateUserDto} updateUserDto - The UpdateUserDto to be mapped.
   * @param {UserEntity} userEntity - The existing UserEntity to be updated.
   * @returns {UserEntity} The updated UserEntity object.
   */
  mapUpdateUserDtoToEntity(
    updateUserDto: UpdateUserDto,
    userEntity: UserEntity,
  ): UserEntity {
    return Object.assign(userEntity, plainToClass(UserEntity, updateUserDto));
  }
}
