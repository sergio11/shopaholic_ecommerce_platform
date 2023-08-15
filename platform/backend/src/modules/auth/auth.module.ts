import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../users/user.entity';
import { RolesService } from 'src/modules/roles/roles.service';
import { RoleEntity } from 'src/modules/roles/role.entity';
import { JwtAuthModule } from './jwt/jwt-auth.module';

@Global()
@Module({
  imports: [ 
    TypeOrmModule.forFeature([UserEntity, RoleEntity]),
    JwtAuthModule
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule {}
