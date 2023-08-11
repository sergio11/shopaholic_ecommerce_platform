import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from '../orders/order.entity';
import { OrderHasProductsEntity } from '../orders/order_has_products.entity';
import { MercadoPagoModule } from './mercadopago/mercadopago.module';
import { StripeModule } from './stripe/stripe.module';
import { PaymentProcessorService } from './payment-processor.service';
import { PaymentServiceFactory } from './payment-factory.service';

@Module({
  imports: [
    StripeModule, 
    MercadoPagoModule,
    HttpModule,
    TypeOrmModule.forFeature([ OrderEntity, OrderHasProductsEntity])
  ],
  providers: [
    PaymentServiceFactory,
    PaymentProcessorService
  ],
  exports: [
    PaymentProcessorService
  ],
  controllers: [PaymentsController]
})
export class PaymentsModule {}
