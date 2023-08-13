import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity } from './role.entity';
import { UserEntity } from 'src/modules/users/user.entity';
import { RoleProfile } from './role.mapper';


@Module({
  imports: [ TypeOrmModule.forFeature([ RoleEntity, UserEntity ]) ],
  providers: [RolesService, RoleProfile],
  controllers: [RolesController]
})
export class RolesModule {}
