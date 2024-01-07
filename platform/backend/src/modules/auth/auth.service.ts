import { Injectable } from '@nestjs/common';
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
import { ResetPasswordDto } from './dto/reset-password.dto';
import { v4 as uuidv4 } from 'uuid';
import { ResetPasswordTokenEntity } from './reset-password-token.entity';
import { AdminSignUpAuthDto } from './dto/admin-signup-auth.dto';
import { CacheService } from '../cache/cache.service';

/**
 * Service for handling authentication related operations.
 */
@Injectable()
export class AuthService extends SupportService {
  /**
   * Constructor for the AuthService class.
   * @param {Repository<UserEntity>} usersRepository - The repository for user entities.
   * @param {Repository<RoleEntity>} rolesRepository - The repository for role entities.
   * @param {Repository<ResetPasswordTokenEntity>} resetPasswordTokenRepository - The repository for reset password tokens.
   * @param {CacheService<string>} cacheService - The cache service.
   * @param {JwtService} jwtService - The JWT service for token handling.
   * @param {UserMapper} userMapper - The user mapper service.
   * @param {I18nService} i18n - The internationalization service.
   */
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    @InjectRepository(RoleEntity)
    private rolesRepository: Repository<RoleEntity>,
    @InjectRepository(ResetPasswordTokenEntity)
    private readonly resetPasswordTokenRepository: Repository<ResetPasswordTokenEntity>,
    private readonly cacheService: CacheService<string>,
    private jwtService: JwtService,
    private readonly userMapper: UserMapper,
    i18n: I18nService,
  ) {
    super(i18n);
  }

  /**
   * Registers a new user.
   * @param {SignUpAuthDto} signUpData - The data for user signup.
   * @returns {Promise<AuthResponseDto>} - The response after user registration.
   */
  async signup(signUpData: SignUpAuthDto): Promise<AuthResponseDto> {
    return this.createUserAndSignJwt(signUpData, ['CLIENT']);
  }

  /**
   * Registers a new admin user.
   * @param {AdminSignUpAuthDto} signUpData - The data for admin signup.
   * @returns {Promise<AuthResponseDto>} - The response after admin registration.
   */
  async signupAdmin(signUpData: AdminSignUpAuthDto): Promise<AuthResponseDto> {
    return this.createUserAndSignJwt(signUpData, ['ADMIN']);
  }

  /**
   * Signs in a user.
   * @param {SignInAuthDto} signInData - The data for user signin.
   * @returns {Promise<AuthResponseDto>} - The response after user signin.
   */
  async signin(signInData: SignInAuthDto): Promise<AuthResponseDto> {
    return this.signinUser(signInData, ['CLIENT']);
  }

  /**
   * Signs in an admin user.
   * @param {SignInAuthDto} signInData - The data for admin signin.
   * @returns {Promise<AuthResponseDto>} - The response after admin signin.
   * @throws {NotFoundException} - If the provided email is not found.
   * @throws {ForbiddenException} - If the user does not have the 'ADMIN' role.
   */
  async signinAdmin(signInData: SignInAuthDto): Promise<AuthResponseDto> {
    return this.signinUser(signInData, ['ADMIN']);
  }

  /**
   * Validates a user by ID.
   * @param {string} id - The ID of the user to validate.
   * @returns {Promise<UserEntity>} - The validated user entity.
   */
  async validateUserById(id: string): Promise<UserEntity> {
    const token = await this.cacheService.get(`session:${id}`);
    if (!token) {
      this.throwUnAuthorizedException('INVALID_CREDENTIALS');
    }
    const userFound = await this.usersRepository.findOne({ where: { id } });
    if (!userFound) {
      this.throwUnAuthorizedException('INVALID_CREDENTIALS');
    }
    return userFound;
  }

  /**
   * Requests a password reset for a user.
   * @param {string} email - The email of the user to reset password for.
   * @returns {Promise<string>} - A success message indicating the request was successful.
   */
  async requestResetPassword(email: string): Promise<string> {
    const userFound = await this.usersRepository.findOne({ where: { email } });
    if (!userFound) {
      this.throwNotFoundException('EMAIL_NOT_FOUND');
    }
    const token = this.generateResetPasswordToken();
    await this.saveResetPasswordToken(userFound, token);
    return this.resolveString('REQUEST_RESET_PASSWORD_SUCCESSFULLY');
  }

  /**
   * Resets a user's password using a reset token.
   * @param {ResetPasswordDto} resetPasswordDto - The data for resetting the password.
   * @returns {Promise<string>} - A success message indicating the password was reset successfully.
   */
  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<string> {
    const { email, newPassword, token } = resetPasswordDto;

    const user: UserEntity = await this.usersRepository.findOne({
      where: { email },
    });

    if (!user) {
      this.throwNotFoundException('USER_NOT_FOUND');
    }

    // Check if the token matches the one sent to the user
    const resetPasswordToken = await this.resetPasswordTokenRepository.findOne({
      where: { idUser: user.id, token },
    });

    if (!resetPasswordToken) {
      this.throwNotFoundException('INVALID_RESET_PASSWORD_TOKEN');
    }

    // Update the user's password and hash it
    await user.updatePassword(newPassword);

    // Delete the used reset password token
    await this.resetPasswordTokenRepository.delete(resetPasswordToken.id);

    // Save the updated user
    await this.usersRepository.save(user);

    return this.resolveString('PASSWORD_RESET_SUCCESSFULLY');
  }

  async revokeUserTokens(userId: string): Promise<string> {
    await this.cacheService.delete(`session:${userId}`);
    return this.resolveString('USER_TOKEN_REVOKED');
  }

  /**
   * Generates a JWT token and constructs the AuthResponseDto.
   * @param {UserEntity} user - The user entity.
   * @returns {Promise<AuthResponseDto>} - The response with user information and JWT token.
   * @private
   */
  private async generateAndSignJwt(user: UserEntity): Promise<AuthResponseDto> {
    const roles = user.roles.map((rol) => rol.name);
    const payload = {
      id: user.id,
      name: user.name,
      roles: roles,
    };

    const token = this.jwtService.sign(payload, {
      secret: jwtConstants.secret,
      expiresIn: jwtConstants.expiresIn
    });

    const userDTO = this.userMapper.mapUserToResponseDto(user);
    const data: AuthResponseDto = {
      user: userDTO,
      token: 'Bearer ' + token,
    };

    // Store the token revocation status in the cache with TTL
    await this.cacheService.set(`session:${user.id}`, token, jwtConstants.expiresIn);

    return data;
  }

  private async createUserAndSignJwt(
    signUpData: SignUpAuthDto | AdminSignUpAuthDto,
    rolesToAssign: string[],
  ): Promise<AuthResponseDto> {
    const { email } = signUpData;
    const emailExist = await this.usersRepository.findOneBy({ email });
    if (emailExist) {
      this.throwConflictException('EMAIL_ALREADY_REGISTERED');
    }

    const newUser = this.usersRepository.create(signUpData);
    const roles = await this.rolesRepository.findBy({
      name: In(rolesToAssign),
    });
    if (roles.length === 0) {
      this.throwConflictException('NO_ROLES_FOUND');
    }
    newUser.roles = roles;

    const userSaved = await this.usersRepository.save(newUser);

    return this.generateAndSignJwt(userSaved);
  }

  private async signinUser(
    signInData: SignInAuthDto,
    requiredRoles: string[],
  ): Promise<AuthResponseDto> {
    const { email, password } = signInData;
    const userFound = await this.usersRepository.findOne({
      where: { email },
      relations: ['roles'],
    });
    if (!userFound) {
      this.throwNotFoundException('USER_NOT_FOUND');
    }

    if (requiredRoles.length > 0) {
      const hasRequiredRole = userFound.roles.some((role) =>
        requiredRoles.includes(role.name),
      );
      if (!hasRequiredRole) {
        this.throwForbiddenException('FORBIDDEN_ACCESS');
      }
    }

    const isPasswordValid = await compare(password, userFound.password);
    if (!isPasswordValid) {
      this.throwForbiddenException('INVALID_CREDENTIALS');
    }

    return this.generateAndSignJwt(userFound);
  }

  /**
   * Generates a reset password token using UUID v4.
   * @returns {string} - The generated reset password token.
   * @private
   */
  private generateResetPasswordToken(): string {
    return uuidv4();
  }

  /**
   * Saves a reset password token for a user.
   * @param {UserEntity} user - The user entity.
   * @param {string} token - The reset password token.
   * @returns {Promise<void>} - A promise that resolves when the token is saved.
   * @private
   */
  private async saveResetPasswordToken(
    user: UserEntity,
    token: string,
  ): Promise<void> {
    const resetPasswordToken = new ResetPasswordTokenEntity();
    resetPasswordToken.token = token;
    resetPasswordToken.user = user;
    await this.resetPasswordTokenRepository.save(resetPasswordToken);
  }
}
