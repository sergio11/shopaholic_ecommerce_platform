import { Injectable, NotFoundException } from '@nestjs/common';
import { PaymentServiceFactory } from './payment-factory.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentCheckoutResponseDto } from './dto/payment-checkout-response.dto';

/**
 * Service responsible for processing payments.
 * This service dynamically selects the appropriate payment service based on the country code provided.
 */
@Injectable()
export class PaymentProcessorService {
  /**
   * Constructs the PaymentProcessorService.
   * @param paymentServiceFactory - The payment service factory used to retrieve payment services.
   */
  constructor(private readonly paymentServiceFactory: PaymentServiceFactory) {}

  /**
   * Creates a payment using the selected payment service.
   * @param data - The data required to create the payment.
   * @returns A promise that resolves to a PaymentCheckoutResponseDto object representing the payment checkout response.
   */
  async createPayment(data: CreatePaymentDto): Promise<PaymentCheckoutResponseDto> {
    // Get the appropriate payment service based on the country code
    const paymentService = this.getPaymentService('es');
    // Delegate the creation of payment to the selected payment service
    return paymentService.createPayment(data);
  }

  /**
   * Retrieves the payment service corresponding to the provided country code.
   * Throws a NotFoundException if the country code is not supported.
   * @param countryCode - The country code for which to retrieve the payment service.
   * @returns The payment service corresponding to the provided country code.
   * @throws NotFoundException if the country code is not supported.
   */
  private getPaymentService(countryCode: string) {
    // Retrieve the payment service using the payment service factory
    const paymentService = this.paymentServiceFactory.getPaymentService(countryCode);
    // Throw NotFoundException if the payment service is not found
    if (!paymentService) {
      throw new NotFoundException('Country not supported');
    }
    return paymentService;
  }
}
