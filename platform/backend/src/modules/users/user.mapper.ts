import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { UserEntity } from './user.entity';
import { UserResponseDto } from './dto/user-response.dto';
import { RoleMapper } from '../roles/role.mapper';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { StorageMixin } from '../storage/mixin/file-saving.mixin';
import { ImageResponseDto } from '../images/dto/image-response.dto';

/**
 * Mapper service for converting UserEntity and DTO objects.
 */
@Injectable()
export class UserMapper {
  /**
   * Creates an instance of UserMapper.
   * @param roleMapper - An instance of RoleMapper.
   * @param storageMixin - An instance of StorageMixin
   */
  constructor(
    private readonly roleMapper: RoleMapper,
    private readonly storageMixin: StorageMixin
  ) {}

  /**
   * Maps a UserEntity object to a UserResponseDto object.
   * @param {UserEntity} user - The UserEntity to be mapped.
   * @returns {UserResponseDto} The mapped UserResponseDto object.
   */
  async mapUserToResponseDto(user: UserEntity): Promise<UserResponseDto> {
    const userDto = plainToClass(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
    if(user.roles) {
      userDto.roles = this.roleMapper.mapRolesToResponseDtos(user.roles);
    }
    if (user.image) {
      const url = await this.storageMixin.getImageUrl(user.image.storageId);
      if (url) {
        const imageResponseDto = new ImageResponseDto();
        imageResponseDto.url = url;
        userDto.image = imageResponseDto;
      }
    }
    return userDto;
  }

  /**
   * Maps an array of UserEntity objects to an array of UserResponseDto objects.
   * @param {UserEntity[]} users - The array of UserEntity objects to be mapped.
   * @returns {UserResponseDto[]} The mapped array of UserResponseDto objects.
   */
  async mapUsersToResponseDtos(users: UserEntity[]): Promise<UserResponseDto[]> {
    const responseDtos: UserResponseDto[] = [];
    for (const user of users) {
      const userResponseDto = await this.mapUserToResponseDto(user);
      responseDtos.push(userResponseDto);
    }
    return responseDtos;
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
