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
     * @param user User data to be created.
     * @param file Image file for the user.
     * @returns The created user entity.
     */
    async create(user: CreateUserDto, file: Express.Multer.File): Promise<UserEntity> {
        user.image = await this.saveFileAndGetImageDto(file);
        const newUser = this.userMapper.mapCreateUserDtoToEntity(user);
        return this.usersRepository.save(newUser);
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
     * @param user Updated user data.
     * @param file Updated image file for the user.
     * @returns The updated user entity.
     */
    async update(id: string, user: UpdateUserDto, file: Express.Multer.File): Promise<UserEntity> {
        const userFound = await this.findUser(id);
        user.image = await this.saveFileAndGetImageDto(file);
        const updatedUser = this.userMapper.mapUpdateUserDtoToEntity(user, userFound);
        return this.usersRepository.save(updatedUser);
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
     * @returns The deleted user entity.
     * @throws NotFoundException if user is not found.
     */
    async delete(id: string): Promise<UserEntity> {
        const userToDelete = await this.findUser(id);
        await this.usersRepository.remove(userToDelete);
        return userToDelete;
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