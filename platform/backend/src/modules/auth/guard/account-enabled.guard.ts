import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth.service';

/**
 * Guard that checks whether the user's account is enabled.
 */
@Injectable()
export class AccountEnabledGuard implements CanActivate {
  /**
   * Creates an instance of AccountEnabledGuard.
   * @param {JwtService} jwtService - The JWT service instance.
   * @param {AuthService} authService - The authentication service instance.
   */
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {}

  /**
   * Determines if the user's account is enabled.
   * @param {ExecutionContext} context - The execution context.
   * @returns {Promise<boolean>} - `true` if the account is enabled, otherwise `false`.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization.replace('Bearer ', '');
    const decodedToken = this.jwtService.decode(token);
    if (!decodedToken) {
      return false;
    }
    const user = await this.authService.validateUserById(decodedToken['id']);
    return user.isEnabled;
  }
}
