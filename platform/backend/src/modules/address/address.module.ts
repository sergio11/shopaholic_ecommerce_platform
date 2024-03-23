import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressEntity } from './address.entity';
import { UserEntity } from '../users/user.entity';
import { OrderEntity } from 'src/modules/orders/order.entity';
import { AddressMapper } from './address.mapper';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AddressEntity, UserEntity, OrderEntity]),
    UsersModule
  ],
  providers: [
    AddressService, 
    AddressEntity,
    AddressMapper
  ],
  controllers: [
    AddressController
  ],
  exports: [
    AddressService, 
    AddressMapper
  ],
})
export class AddressModule {}
