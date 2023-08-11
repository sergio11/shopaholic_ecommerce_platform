import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressEntity } from './address.entity';
import { UserEntity } from '../users/user.entity';
import { JwtStrategy } from '../auth/jwt/jwt.strategy';
import { OrderEntity } from 'src/modules/orders/order.entity';
import { AddressProfile } from './adress.mapper';

@Module({
  imports: [ TypeOrmModule.forFeature([AddressEntity, UserEntity, OrderEntity]) ],
  providers: [
    AddressService, 
    JwtStrategy,
    AddressProfile
  ],
  controllers: [AddressController]
})
export class AddressModule {}
