import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../users/user.entity';
import { RoleEntity } from 'src/modules/roles/role.entity';
import { JwtAuthModule } from './jwt/jwt-auth.module';
import { RolesModule } from '../roles/roles.module';
import { UsersModule } from '../users/users.module';
import { AccountEnabledGuard } from './guard/account-enabled.guard';
import { ResetPasswordTokenEntity } from './reset-password-token.entity';

@Module({
  imports: [ 
    TypeOrmModule.forFeature([UserEntity, RoleEntity, ResetPasswordTokenEntity]),
    JwtAuthModule,
    RolesModule,
    UsersModule
  ],
  providers: [AuthService, AccountEnabledGuard],
  controllers: [AuthController],
  exports: [AuthService, AccountEnabledGuard, JwtAuthModule]
})
export class AuthModule {}
