import { Module } from '@nestjs/common';
import { MercadoPagoPaymentService } from './mercadopago-payment.service';

@Module({
  providers: [MercadoPagoPaymentService],
  exports: [MercadoPagoPaymentService],
})
export class MercadoPagoModule {}