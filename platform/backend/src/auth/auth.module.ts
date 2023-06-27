import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './jwt/jwt.constants';
import { JwtStrategy } from './jwt/jwt.strategy';
import { RolesService } from 'src/roles/roles.service';
import { Rol } from 'src/roles/rol.entity';

@Module({
  imports: [ 
    TypeOrmModule.forFeature([User, Rol]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '2d' },
    }),
  ],
  providers: [AuthService, RolesService, JwtStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
