import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from './address.entity';
import { User } from '../users/user.entity';
import { JwtStrategy } from '../auth/jwt/jwt.strategy';

@Module({
  imports: [ TypeOrmModule.forFeature([Address, User]) ],
  providers: [AddressService, JwtStrategy],
  controllers: [AddressController]
})
export class AddressModule {}
