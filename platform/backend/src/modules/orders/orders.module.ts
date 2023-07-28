import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './order.entity';
import { OrderHasProductsEntity } from './order_has_products.entity';
import { UserEntity } from 'src/modules/users/user.entity';
import { AddressEntity } from '../address/address.entity';
import { ProductEntity } from '../products/product.entity';

@Module({
  imports: [ TypeOrmModule.forFeature([ OrderEntity, OrderHasProductsEntity, UserEntity, AddressEntity, ProductEntity ]) ],
  providers: [OrdersService],
  controllers: [OrdersController]
})
export class OrdersModule {}
