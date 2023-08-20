import { Injectable, NotFoundException } from '@nestjs/common';
import { PaymentServiceFactory } from './payment-factory.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentProcessorService {
  constructor(private readonly paymentServiceFactory: PaymentServiceFactory) {}

  async createPayment(data: CreatePaymentDto): Promise<string> {
    const paymentService = this.getPaymentService('es');
    return paymentService.createPayment(data);
  }

  private getPaymentService(countryCode: string) {
    const paymentService =
      this.paymentServiceFactory.getPaymentService(countryCode);
    if (!paymentService) {
      throw new NotFoundException('Country not supported');
    }
    return paymentService;
  }
}
