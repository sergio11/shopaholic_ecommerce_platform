import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../users/user.entity';
import { Repository, In } from 'typeorm';
import { SignUpAuthDto } from './dto/signup-auth.dto';
import { SignInAuthDto } from './dto/signin-auth.dto';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RoleEntity } from '../roles/role.entity';
import { SupportService } from 'src/core/support.service';
import { I18nService } from 'nestjs-i18n';
import { AuthResponseDto } from './dto/auth-response.dto';
import { jwtConstants } from './jwt/jwt.constants';
import { UserMapper } from '../users/user.mapper';
import { IStorageService, STORAGE_SERVICE } from '../storage/storage.service';


@Injectable()
export class AuthService extends SupportService {

    /**
     * Constructor for the AuthService class.
     * @param {Repository<UserEntity>} usersRepository - The repository for user entities.
     * @param {Repository<RoleEntity>} rolesRepository - The repository for role entities.
     * @param {IStorageService} storageService - The storage service.
     * @param {JwtService} jwtService - The JWT service for token handling.
     * @param {UserMapper} userMapper - The user mapper service.
     * @param {I18nService} i18n - The internationalization service.
     */
    constructor(
        @InjectRepository(UserEntity) private usersRepository: Repository<UserEntity>,
        @InjectRepository(RoleEntity) private rolesRepository: Repository<RoleEntity>,
        @Inject(STORAGE_SERVICE)
        storageService: IStorageService,
        private jwtService: JwtService,
        private readonly userMapper: UserMapper,
        i18n: I18nService
    ) {
        super(i18n, storageService);
    }

    /**
     * Registers a new user.
     * @param {SignUpAuthDto} signUpData - The data for user signup.
     * @returns {Promise<AuthResponseDto>} - The response after user registration.
     */
    async signup(signUpData: SignUpAuthDto): Promise<AuthResponseDto> {
        const { email, phone } = signUpData;
        const emailExist = await this.usersRepository.findOneBy({ email: email })
        if (emailExist) {
            this.throwConflictException("EMAIL_ALREADY_REGISTERED");
        }
        const phoneExist = await this.usersRepository.findOneBy({phone: phone});
        if (phoneExist) {
            this.throwConflictException("PHONE_ALREADY_REGISTERED");
        }

        const newUser = this.usersRepository.create(signUpData);
        let rolesNames = [];
        
        if (signUpData.rolesName !== undefined && signUpData.rolesName !== null) { // DATA
            rolesNames = signUpData.rolesName;
        }
        else {
            rolesNames.push('CLIENT');
        }
        
        const roles = await this.rolesRepository.findBy({ name: In(rolesNames) });
        if (roles.length == 0) {
            this.throwConflictException("NO_ROLES_FOUND");
        }
        newUser.roles = roles;

        const userSaved = await this.usersRepository.save(newUser);

        return this.generateAndSignJwt(userSaved);
    }


    /**
     * Signs in a user.
     * @param {SignInAuthDto} signInData - The data for user signin.
     * @returns {Promise<AuthResponseDto>} - The response after user signin.
     */
    async signin(signInData: SignInAuthDto): Promise<AuthResponseDto> {

        const { email, password } = signInData;
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

        return this.generateAndSignJwt(userFound);
    }

    async validateUserById(email: string): Promise<UserEntity> {
        const userFound = await this.usersRepository.findOne({ 
            where: { email: email },
            relations: ['roles']
        })
        if (!userFound) {
            this.throwUnAuthorizedException("INVALID_CREDENTIALS");
        }
        return userFound;
      }

    /**
     * Generates a JWT token and constructs the AuthResponseDto.
     * @param {UserEntity} user - The user entity.
     * @returns {AuthResponseDto} - The response with user information and JWT token.
     * @private
     */
    private generateAndSignJwt(user: UserEntity): AuthResponseDto {
        const roles = user.roles.map(rol => rol.name);
        const payload = { 
            id: user.id, 
            name: user.name, 
            roles: roles 
        };
        const token = this.jwtService.sign(payload, { secret: jwtConstants.secret});
        const userDTO = this.userMapper.mapUserToResponseDto(user);
        const data: AuthResponseDto = {
            user: userDTO,
            token: 'Bearer ' + token
        }
        return data;
    }
}
