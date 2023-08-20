import { Injectable } from '@nestjs/common';
import { StripePaymentService } from './stripe/stripe-payment.service';
import { MercadoPagoPaymentService } from './mercadopago/mercadopago-payment.service';

@Injectable()
export class PaymentServiceFactory {
  
  constructor(
    private readonly stripePaymentService: StripePaymentService,
    private readonly mercadoPagoPaymentService: MercadoPagoPaymentService
  ) {}

  getPaymentService(countryCode: string) {
    if (this.stripePaymentService.isSupportedCountry(countryCode)) {
      return this.stripePaymentService;
    } else if (this.mercadoPagoPaymentService.isSupportedCountry(countryCode)) {
      return this.mercadoPagoPaymentService;
    } else {
      throw new Error('Payment service not available for this country');
    }
  }
}
