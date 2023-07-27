import { Module } from '@nestjs/common';
import { MercadoPagoService } from './mercado_pago.service';
import { MercadoPagoController } from './mercado_pago.controller';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../orders/order.entity';
import { OrderHasProducts } from '../orders/order_has_products.entity';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([ Order, OrderHasProducts])],
  providers: [MercadoPagoService],
  controllers: [MercadoPagoController]
})
export class MercadoPagoModule {}
