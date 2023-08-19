import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { RoleEntity } from 'src/modules/roles/role.entity';
import { UserMapper } from './user.mapper';
import { RolesModule } from '../roles/roles.module';
import { FilesStorageModule } from '../storage/storage.module';

@Module({
  imports: [ 
    TypeOrmModule.forFeature([UserEntity, RoleEntity]), 
    RolesModule,
    FilesStorageModule
  ],
  providers: [UsersService, UserMapper],
  controllers: [UsersController],
  exports: [UsersService, UserMapper]
})
export class UsersModule {}
