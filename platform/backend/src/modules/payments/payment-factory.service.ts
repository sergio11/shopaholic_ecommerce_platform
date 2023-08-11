import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { MercadoPagoPaymentService } from './mercadopago/mercadopago-payment.service';
import { StripePaymentService } from './stripe/stripe-payment.service';

@Injectable()
export class PaymentServiceFactory {
  private stripeSupportedCountries: string[] = [];
  private mercadoPagoSupportedCountries: string[] = [];

  constructor(
    private readonly httpService: HttpService,
    private readonly stripePaymentService: StripePaymentService,
    private readonly mercadoPagoPaymentService: MercadoPagoPaymentService
  ) {
    this.fetchStripeSupportedCountries();
    this.fetchMercadoPagoSupportedCountries();
  }

  getSupportedCountries(): string[] {
    return this.stripeSupportedCountries.concat(this.mercadoPagoSupportedCountries);
  }


  getPaymentService(countryCode: string) {
    if (this.stripeSupportedCountries.includes(countryCode)) {
      return this.stripePaymentService;
    } else if (this.mercadoPagoSupportedCountries.includes(countryCode)) {
      return this.mercadoPagoPaymentService;
    } else {
      throw new Error('Payment service not available for this country');
    }
  }

  private fetchStripeSupportedCountries() {
    // Hacer una llamada a la API de Stripe para obtener la lista de países admitidos
    const stripeApiUrl = 'https://api.stripe.com/v1/country_specs';
    this.httpService.get(stripeApiUrl).pipe(
      map(response => response.data),
      map(data => data.map(countrySpec => countrySpec.id)),
    ).subscribe(supportedCountries => {
      this.stripeSupportedCountries = supportedCountries;
    });
  }

  private fetchMercadoPagoSupportedCountries() {
    // Hacer una llamada a la API de Mercado Pago para obtener la lista de países admitidos
    const mercadoPagoApiUrl = 'https://api.mercadopago.com/v1/payment_methods';
    this.httpService.get(mercadoPagoApiUrl).pipe(
      map(response => response.data),
      map(data => data.map(paymentMethod => paymentMethod.country_id)),
    ).subscribe(supportedCountries => {
      this.mercadoPagoSupportedCountries = supportedCountries;
    });
  }
}
