import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../users/user.entity';
import { Repository, In } from 'typeorm';
import { SignUpAuthDto } from './dto/signup-auth.dto';
import { SignInAuthDto } from './dto/signin-auth.dto';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RoleEntity } from '../roles/rol.entity';
import { SupportService } from 'src/core/support.service';
import { I18nService } from 'nestjs-i18n';


@Injectable()
export class AuthService extends SupportService {

    constructor(
        @InjectRepository(UserEntity) private usersRepository: Repository<UserEntity>,
        @InjectRepository(RoleEntity) private rolesRepository: Repository<RoleEntity>,
        private jwtService: JwtService,
        i18n: I18nService
    ) {
        super(i18n);
    }

    async register(user: SignUpAuthDto) {
        const { email, phone } = user;
        const emailExist = await this.usersRepository.findOneBy({ email: email })
        if (emailExist) {
            this.throwConflictException("EMAIL_ALREADY_REGISTERED");
        }
        const phoneExist = await this.usersRepository.findOneBy({phone: phone});
        if (phoneExist) {
            this.throwConflictException("PHONE_ALREADY_REGISTERED");
        }

        const newUser = this.usersRepository.create(user);
        let rolesIds = [];
        
        if (user.rolesIds !== undefined && user.rolesIds !== null) { // DATA
            rolesIds = user.rolesIds;
        }
        else {
            rolesIds.push('CLIENT');
        }
        
        const roles = await this.rolesRepository.findBy({ id: In(rolesIds) });
        newUser.roles = roles;

        const userSaved = await this.usersRepository.save(newUser);

        const rolesString = userSaved.roles.map(rol => rol.id);
        const payload = { id: userSaved.id, name: userSaved.name, roles: rolesString };
        const token = this.jwtService.sign(payload);
        const data = {
            user: userSaved,
            token: 'Bearer ' + token
        }
        delete data.user.password;
        return data;
    }

    async login(loginData: SignInAuthDto) {

        const { email, password } = loginData;
        const userFound = await this.usersRepository.findOne({ 
            where: { email: email },
            relations: ['roles']
         })
        if (!userFound) {
            this.throwNotFoundException("EMAIL_NOT_FOUND");
        }
        
        const isPasswordValid = await compare(password, userFound.password);
        if (!isPasswordValid) {
            this.throwForbiddenException("INVALID_CREDENTIALS");
        }

        const rolesIds = userFound.roles.map(rol => rol.id);

        const payload = { 
            id: userFound.id, 
            name: userFound.name, 
            roles: rolesIds 
        };
        const token = this.jwtService.sign(payload);
        const data = {
            user: userFound,
            token: 'Bearer ' + token
        }

        delete data.user.password;

        return data;
    }

}
