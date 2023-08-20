import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { PaymentService } from '../interfaces/payment.service';
import { SupportService } from 'src/core/support.service';
import { I18nService } from 'nestjs-i18n';
import Stripe from 'stripe';

@Injectable()
export class StripePaymentService
  extends SupportService
  implements PaymentService
{
  private stripe: Stripe;
  private stripeSupportedCountries: Set<string> = new Set();

  constructor(i18n: I18nService) {
    super(i18n);
    this.stripe = new Stripe('test', {
      apiVersion: '2023-08-16',
    });
    this.fetchStripeSupportedCountries();
  }

  async createPayment(data: CreatePaymentDto): Promise<string> {
    return 'Hello!!!';
  }

  isSupportedCountry(countryCode: string): boolean {
    const lowercaseCountryCode = countryCode.toUpperCase();
    return this.stripeSupportedCountries.has(lowercaseCountryCode);
  }

  private async fetchStripeSupportedCountries() {
    const countrySpecs = await this.stripe.countrySpecs.list({ limit: 100 });
    countrySpecs.data.forEach(spec => {
      this.stripeSupportedCountries.add(spec.id.toUpperCase());
    });
    console.log("StripeSupportedCountries", this.stripeSupportedCountries);
  }
}
