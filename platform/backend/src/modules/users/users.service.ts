import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SupportService } from 'src/core/support.service'
import { I18nService } from 'nestjs-i18n';
import { Mapper } from '@automapper/core';
import storage = require('../../core/utils/cloud_storage');
import { UserDto } from './dto/user.dto';
import { InjectMapper } from '@automapper/nestjs';

@Injectable()
export class UsersService extends SupportService {

    constructor(
        @InjectRepository(UserEntity) private usersRepository: Repository<UserEntity>,
        @InjectMapper() private readonly classMapper: Mapper,
        i18n: I18nService
    ) {
        super(i18n)
    }
    
    create(user: CreateUserDto) {
        const newUser = this.usersRepository.create(user);
        return this.usersRepository.save(newUser);
    }

    
    async findAll(): Promise<UserDto[]> {
        return this.classMapper.mapArrayAsync(await this.usersRepository.find({ relations: ['roles'] }), UserEntity, UserDto);
    }

    
    async update(id: string, user: UpdateUserDto) {
        const userFound = await this.findUser(id);
        const updatedUser = Object.assign(userFound, user);
        return this.usersRepository.save(updatedUser);
    }
    

    async updateWithImage(file: Express.Multer.File, id: string, user: UpdateUserDto) {
        const url = await storage(file, file.originalname);
        console.log('URL: ' + url);
        if (url === undefined && url === null) {
            this.throwInternalServerError("app.IMAGE_ERROR");
        }
        const userFound = await this.findUser(id);
        user.image = url;
        const updatedUser = Object.assign(userFound, user);
        return this.usersRepository.save(updatedUser);
    }

    private async findUser(id: string) {
        const userFound = await this.usersRepository.findOneBy({id: id});
        if (!userFound) {
            this.throwNotFoundException("app.USER_NOT_FOUND");
        }
        return userFound;
    }
    
}

