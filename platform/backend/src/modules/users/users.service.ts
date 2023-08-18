import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SupportService } from 'src/core/support.service';
import { I18nService } from 'nestjs-i18n';
import { IStorageService, STORAGE_SERVICE } from '../storage/storage.service';
import { UserResponseDto } from './dto/user-response.dto';
import { UserMapper } from './user.mapper';

/**
 * Service responsible for handling user-related operations.
 */
@Injectable()
export class UsersService extends SupportService {

    /**
     * Constructor of the UsersService class.
     * @param usersRepository Injected repository for UserEntity.
     * @param userMapper Injected UserMapper for mapping user data.
     * @param storageService Injected storage service for file handling.
     * @param i18n Injected internationalization service.
     */
    constructor(
        @InjectRepository(UserEntity) private usersRepository: Repository<UserEntity>,
        private readonly userMapper: UserMapper,
        @Inject(STORAGE_SERVICE) storageService: IStorageService,
        i18n: I18nService
    ) {
        super(i18n, storageService);
    }
    
    /**
     * Creates a new user with provided data and image.
     * @param createUserDto User data to be created.
     * @returns The created user.
     */
    async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
        createUserDto.image = await this.saveFileAndGetImageDto(createUserDto.imageFile);
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
     * Updates an existing user's data and image.
     * @param id ID of the user to be updated.
     * @param updateUserDto Updated user data.
     * @returns The updated user.
     */
    async update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
        const userFound = await this.findUser(id);
        updateUserDto.image = await this.saveFileAndGetImageDto(updateUserDto.imageFile);
        const updatedUser = this.userMapper.mapUpdateUserDtoToEntity(updateUserDto, userFound);
        const userUpdated = await this.usersRepository.save(updatedUser);
        return this.userMapper.mapUserToResponseDto(userUpdated);
    }

    /**
     * Search for users by name (case-insensitive).
     * @param name The name to search for.
     * @returns List of users matching the name.
     */
    async searchByName(name: string): Promise<UserResponseDto[]> {
        const users = await this.usersRepository
            .createQueryBuilder('user')
            .where('LOWER(user.name) LIKE :name', { name: `%${name.toLowerCase()}%` })
            .getMany();
        return this.userMapper.mapUsersToResponseDtos(users);
    }

    /**
     * Deletes a user by ID.
     * @param id ID of the user to be deleted.
     * @returns The deleted user.
     * @throws NotFoundException if user is not found.
     */
    async delete(id: string): Promise<UserResponseDto> {
        const userToDelete = await this.findUser(id);
        await this.usersRepository.remove(userToDelete);
        return this.userMapper.mapUserToResponseDto(userToDelete);
    }

    /**
     * Finds a user by their ID.
     * @param id ID of the user to be found.
     * @returns The found user entity.
     * @throws NotFoundException if user is not found.
     */
    private async findUser(id: string): Promise<UserEntity> {
        const userFound = await this.usersRepository.findOneBy({ id: id });
        if (!userFound) {
            this.throwNotFoundException("app.USER_NOT_FOUND");
        }
        return userFound;
    }
}