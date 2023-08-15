import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../users/user.entity';
import { RoleEntity } from 'src/modules/roles/role.entity';
import { JwtAuthModule } from './jwt/jwt-auth.module';
import { RolesModule } from '../roles/roles.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [ 
    TypeOrmModule.forFeature([UserEntity, RoleEntity]),
    JwtAuthModule,
    RolesModule,
    UsersModule
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule {}
