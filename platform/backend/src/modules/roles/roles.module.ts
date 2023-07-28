import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity } from './rol.entity';
import { UserEntity } from 'src/modules/users/user.entity';
import { JwtStrategy } from '../auth/jwt/jwt.strategy';


@Module({
  imports: [ TypeOrmModule.forFeature([ RoleEntity, UserEntity ]) ],
  providers: [RolesService, JwtStrategy],
  controllers: [RolesController]
})
export class RolesModule {}
