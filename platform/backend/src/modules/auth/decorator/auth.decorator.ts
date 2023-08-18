import { UseGuards, applyDecorators } from '@nestjs/common';
import { JwtRole } from '../jwt/jwt-role';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { HasRoles } from '../jwt/has-roles';
import { JwtAuthGuard } from '../jwt/jwt-auth.guard';
import { JwtRolesGuard } from '../jwt/jwt-roles.guard';
import { AccountEnabledGuard } from '../guard/account-enabled.guard';

export function Auth(...roles: JwtRole[]) {
  return applyDecorators(
    HasRoles(...roles),
    UseGuards(JwtAuthGuard, JwtRolesGuard, AccountEnabledGuard),
    ApiBearerAuth(),
    ApiResponse({ status: 403, description: 'Forbidden.' })
  );
}