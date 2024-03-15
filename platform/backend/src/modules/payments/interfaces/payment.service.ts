import { CreatePaymentDto } from '../dto/create-payment.dto';
import { PaymentCheckoutResponseDto } from '../dto/payment-checkout-response.dto';

/**
 * Interface for payment service operations.
 */
export interface PaymentService {
  /**
   * Creates a payment using the provided data.
   * @param {CreatePaymentDto} data - Data for creating the payment.
   * @returns {Promise<PaymentCheckoutResponseDto>} - Response containing payment information.
   */
  createPayment(data: CreatePaymentDto): Promise<PaymentCheckoutResponseDto>;

  isSupportedCountry(countryCode: string): boolean;
}
