import { Module } from '@nestjs/common';
import { MercadoPagoService } from './mercado_pago.service';
import { MercadoPagoController } from './mercado_pago.controller';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from '../orders/order.entity';
import { OrderHasProductsEntity } from '../orders/order_has_products.entity';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([ OrderEntity, OrderHasProductsEntity])],
  providers: [MercadoPagoService],
  controllers: [MercadoPagoController]
})
export class MercadoPagoModule {}
