import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity } from './role.entity';
import { UserEntity } from 'src/modules/users/user.entity';
import { RoleMapper } from './role.mapper';
import { FilesStorageModule } from '../storage/storage.module';

@Module({
  imports: [ 
    TypeOrmModule.forFeature([ RoleEntity, UserEntity ]),
    FilesStorageModule
  ],
  providers: [RolesService, RoleMapper],
  controllers: [RolesController],
  exports: [RolesService, RoleMapper]
})
export class RolesModule {}
