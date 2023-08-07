import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { JwtStrategy } from '../auth/jwt/jwt.strategy';
import { RoleEntity } from 'src/modules/roles/rol.entity';
import { UserProfile } from './user.mapper';

@Module({
  imports: [ TypeOrmModule.forFeature([UserEntity, RoleEntity]) ],
  providers: [UsersService, JwtStrategy, UserProfile],
  controllers: [UsersController]
})
export class UsersModule {}
