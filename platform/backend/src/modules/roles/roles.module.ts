import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity } from './role.entity';
import { UserEntity } from 'src/modules/users/user.entity';
import { JwtStrategy } from '../auth/jwt/jwt.strategy';
import { RoleProfile } from './role.mapper';


@Module({
  imports: [ TypeOrmModule.forFeature([ RoleEntity, UserEntity ]) ],
  providers: [RolesService, JwtStrategy, RoleProfile],
  controllers: [RolesController]
})
export class RolesModule {}
