import { Module } from '@nestjs/common';
import { StripePaymentService } from './stripe-payment.service';

@Module({
  providers: [StripePaymentService],
  exports: [StripePaymentService],
})
export class StripeModule {}
