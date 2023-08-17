import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';

@Injectable()
export class AccountEnabledGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization.replace('Bearer ', '');
    const decodedToken = this.jwtService.decode(token);
    if (!decodedToken) {
      return false;
    }
    const user = await this.authService.validateUserById(decodedToken.sub);
    if (!user && !user.isEnabled) {
      return false;
    }
  }
}
