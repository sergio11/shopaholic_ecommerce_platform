import { Injectable, NotFoundException } from '@nestjs/common';
import { PaymentServiceFactory } from './payment-factory.service';


@Injectable()
export class PaymentProcessorService {
  
    constructor(private readonly paymentServiceFactory: PaymentServiceFactory) {}

    async createPayment(
        countryCode: string,
        amount: number,
        currency: string,
        paymentMethodId: string,
    ): Promise<string> {
        const paymentService = this.getPaymentService(countryCode);
        return paymentService.createPayment(amount, currency, paymentMethodId);
    }

    async retrievePayment(
        countryCode: string,
        paymentId: string,
    ): Promise<any> {
        const paymentService = this.getPaymentService(countryCode);
        return paymentService.getPayment(paymentId);
    }

    async getSupportedCountries(): Promise<string[]> {
        return this.paymentServiceFactory.getSupportedCountries();
    }

    async getCountryPaymentMethods(countryCode: string): Promise<string[]> {
        const paymentService = this.getPaymentService(countryCode);
        return null;
    }

    async getIdentificationTypes(countryCode: string): Promise<string[]> {
        const paymentService = this.getPaymentService(countryCode);
        return paymentService.getIdentificationTypes();
    }

    async getInstallments(
        countryCode: string,
        amount: number,
        paymentMethodId: string,
    ): Promise<any[]> {
        const paymentService = this.getPaymentService(countryCode);
        return paymentService.getInstallments(amount, paymentMethodId);
    }

    private getPaymentService(countryCode: string) {
        const paymentService = this.paymentServiceFactory.getPaymentService(
          countryCode,
        );
        if (!paymentService) {
          throw new NotFoundException('Country not supported');
        }
        return paymentService;
    }
}
