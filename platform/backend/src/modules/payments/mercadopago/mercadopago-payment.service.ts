import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { PaymentService } from '../interfaces/payment.service';
import { PaymentCheckoutResponseDto } from '../dto/payment-checkout-response.dto';

@Injectable()
export class MercadoPagoPaymentService implements PaymentService {
  constructor() {}
  
  isSupportedCountry(countryCode: string): boolean {
    throw new Error('Method not implemented.');
  }

  async createPayment(data: CreatePaymentDto): Promise<PaymentCheckoutResponseDto> {
    throw new Error('Method not implemented.');
  }
}
