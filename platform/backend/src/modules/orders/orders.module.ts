import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './order.entity';
import { OrderHasProductsEntity } from './order_has_products.entity';
import { UserEntity } from 'src/modules/users/user.entity';
import { AddressEntity } from '../address/address.entity';
import { ProductEntity } from '../products/product.entity';
import { OrderMapper } from './order.mapper';
import { AddressModule } from '../address/address.module';
import { UsersModule } from '../users/users.module';
import { ProductsModule } from '../products/products.module';
import { PaymentsModule } from '../payments/payments.module';
import { FilesStorageModule } from '../storage/storage.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderEntity,
      OrderHasProductsEntity,
      UserEntity,
      AddressEntity,
      ProductEntity,
    ]),
    AddressModule,
    UsersModule,
    ProductsModule,
    PaymentsModule,
    FilesStorageModule
  ],
  providers: [OrdersService, OrderMapper],
  controllers: [OrdersController],
  exports: [OrdersService, OrderMapper],
})
export class OrdersModule {}
