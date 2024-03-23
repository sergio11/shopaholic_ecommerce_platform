import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../users/user.entity';
import { RoleEntity } from '../roles/role.entity';
import { SeedingService } from './seeding.service';


@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, RoleEntity])
  ],
  providers: [
    SeedingService
  ],
  exports: [
    SeedingService
  ],
})
export class SeedModule {}
