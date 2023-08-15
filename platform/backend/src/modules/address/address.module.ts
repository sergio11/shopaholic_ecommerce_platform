import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressEntity } from './address.entity';
import { UserEntity } from '../users/user.entity';
import { OrderEntity } from 'src/modules/orders/order.entity';

@Module({
  imports: [ TypeOrmModule.forFeature([AddressEntity, UserEntity, OrderEntity]) ],
  providers: [
    AddressService, 
    AddressEntity
  ],
  controllers: [AddressController]
})
export class AddressModule {}
