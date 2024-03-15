import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from '../orders/order.entity';
import { OrderHasProductsEntity } from '../orders/order_has_products.entity';
import { MercadoPagoModule } from './mercadopago/mercadopago.module';
import { StripePaymentsModule } from './stripe/stripe-payment.module';
import { PaymentProcessorService } from './payment-processor.service';
import { PaymentServiceFactory } from './payment-factory.service';
import { TransactionRecordEntity } from './transaction-record.entity';
import { UserEntity } from '../users/user.entity';

@Module({
  imports: [
    StripePaymentsModule, 
    MercadoPagoModule,
    HttpModule,
    TypeOrmModule.forFeature([ OrderEntity, OrderHasProductsEntity, TransactionRecordEntity, UserEntity])
  ],
  providers: [
    PaymentServiceFactory,
    PaymentProcessorService
  ],
  exports: [
    PaymentProcessorService
  ]
})
export class PaymentsModule {}
