import { Module } from '@nestjs/common';
import { MercadoPagoPaymentService } from 'src/modules/mercado_pago/mercado-pago-payment.service';

@Module({
  providers: [MercadoPagoPaymentService],
  exports: [MercadoPagoPaymentService],
})
export class MercadoPagoModule {}