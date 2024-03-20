import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SupportService } from 'src/core/support.service';
import { I18nService } from 'nestjs-i18n';
import { UserResponseDto } from './dto/user-response.dto';
import { UserMapper } from './user.mapper';
import { StorageMixin } from 'src/modules/storage/mixin/file-saving.mixin';
import { JwtRole } from '../auth/jwt/jwt-role';
import { Pagination, paginate } from 'nestjs-typeorm-paginate';
import { RoleEntity } from '../roles/role.entity';
import { UpdatePasswordDto } from './dto/update-password.dto';

/**
 * Service responsible for handling user-related operations.
 */
@Injectable()
export class UsersService extends SupportService {
  /**
   * Constructor of the UsersService class.
   * @param usersRepository Injected repository for UserEntity.
   * @param rolesRepository Injected repository for RoleEntity.
   * @param userMapper Injected UserMapper for mapping user data.
   * @param i18n Injected internationalization service.
   */
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    @InjectRepository(RoleEntity)
    private rolesRepository: Repository<RoleEntity>,
    private readonly userMapper: UserMapper,
    private readonly fileSavingMixin: StorageMixin,
    i18n: I18nService,
  ) {
    super(i18n);
  }

  /**
   * Creates a new user with provided data and image.
   * @param createUserDto User data to be created.
   * @returns The created user.
   */
  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    if(createUserDto.imageFile) {
      createUserDto.image = await this.fileSavingMixin.saveImageFile(
        createUserDto.imageFile,
      );
    }
    const newUser = this.userMapper.mapCreateUserDtoToEntity(createUserDto);
    const userCreated = await this.usersRepository.save(newUser);
    return this.userMapper.mapUserToResponseDto(userCreated);
  }

  /**
   * Retrieves a list of all users with their roles.
   * @returns A list of user response DTOs.
   */
  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.usersRepository.find({ relations: ['roles'] });
    return this.userMapper.mapUsersToResponseDtos(users);
  }

  /**
   * Retrieve user details by ID.
   * @param id The ID of the user to retrieve.
   * @returns The user response DTO.
   */
  async getUserById(id: string): Promise<UserResponseDto> {
    const user = await this.findUser(id);
    return this.userMapper.mapUserToResponseDto(user);
  }

  /**
   * Updates an existing user's data and image.
   * @param id ID of the user to be updated.
   * @param updateUserDto Updated user data.
   * @returns The updated user.
   */
  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const userFound = await this.findUser(id);
    if(updateUserDto.imageFile) {
      updateUserDto.image = await this.fileSavingMixin.saveImageFile(
        updateUserDto.imageFile,
        userFound.image,
      );
    }
    const updatedUser = this.userMapper.mapUpdateUserDtoToEntity(
      updateUserDto,
      userFound,
    );
    const userUpdated = await this.usersRepository.save(updatedUser);
    return this.userMapper.mapUserToResponseDto(userUpdated);
  }

  /**
   * Search for users by name and filter by role, then paginate the results.
   * @param {string} term - The term to search for.
   * @param {JwtRole} role - The role to filter users by.
   * @param {number} page - The page number for pagination.
   * @param {number} limit - The maximum number of items per page.
   * @returns {Promise<Pagination<UserResponseDto>>} A Pagination object containing the matching users and pagination metadata.
   */
  async searchAndPaginateUsers(
    term: string | undefined,
    role: JwtRole | undefined,
    page: number = 1,
    limit: number = 10,
  ): Promise<Pagination<UserResponseDto>> {
    if (page < 1) {
      this.throwBadRequestException('PAGE_NUMBER_NOT_VALID');
    }

    if (limit < 1 || limit > 100) {
      this.throwBadRequestException('LIMIT_NUMBER_NOT_VALID');
    }

    let queryBuilder = this.usersRepository.createQueryBuilder('user');

    if (term) {
      console.log("queryBuilder.where term", term);
      queryBuilder = queryBuilder.where(
        '(LOWER(user.name) LIKE :term OR LOWER(user.lastname) LIKE :term)',
        {
          term: `%${term.toLowerCase()}%`,
        },
      );
    }

    // Add a filter for the "role" if provided
    if (role) {
      queryBuilder = queryBuilder
      .leftJoinAndSelect('user.image', 'image')
      .innerJoinAndSelect(
        'user.roles',
        'user_roles',
        'user_roles.name = :role',
        { role }
      );
    }

    const [query, parameters] = queryBuilder.getQueryAndParameters();
    console.log('SQL Query:', query);
    console.log('Parameters:', parameters);

    const paginatedUser = await paginate(queryBuilder, { page, limit });
    const items = paginatedUser.items.map((user) =>
      this.userMapper.mapUserToResponseDto(user),
    );

    return {
      ...paginatedUser,
      items,
    };
  }

  /**
   * Update the password of a user.
   * @param id The ID of the user to update the password for.
   * @param updatePasswordDto The DTO containing the current and new passwords.
   * @returns The updated user entity.
   */
  async updatePassword(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<string> {
    const user = await this.findUser(id);
    const isCurrentPasswordValid = await user.comparePassword(
      updatePasswordDto.currentPassword,
    );
    if (!isCurrentPasswordValid) {
      throw this.throwBadRequestException('INVALID_PASSWORD');
    }
    // Update the user's password
    user.updatePassword(updatePasswordDto.newPassword);
    await this.usersRepository.save(user);
    return this.resolveString('USER_PASSWORD_UPDATED_SUCCESSFULLY');
  }

  /**
   * Deletes a user by ID.
   * @param id ID of the user to be deleted.
   * @returns The deleted user.
   * @throws NotFoundException if user is not found.
   */
  async delete(id: string): Promise<string> {
    const userToDelete = await this.findUser(id);
    await this.usersRepository.remove(userToDelete);
    await this.fileSavingMixin.removeImageFile(userToDelete.image);
    return this.resolveString('USER_DELETED_SUCCESSFULLY');
  }

  async updateReviewCount(user: UserEntity, increment: number): Promise<void> {
    user.reviewCount += increment;
    await this.usersRepository.save(user);
  }

  /**
   * Updates the address count for the user.
   * @param user - The user entity whose address count needs to be updated.
   * @param increment - The value to increment the address count by (can be positive or negative).
   * @returns Promise<void>
   */
  async updateAddressCount(user: UserEntity, increment: number): Promise<void> {
    user.addressCount += increment;
    await this.usersRepository.save(user);
  }

  /**
   * Finds a user by their ID.
   * @param id ID of the user to be found.
   * @returns The found user entity.
   * @throws NotFoundException if user is not found.
   */
  private async findUser(id: string): Promise<UserEntity> {
    return this.findEntityById(id, this.usersRepository, 'USER_NOT_FOUND', [
      'roles', 'image'
    ]);
  }
}
