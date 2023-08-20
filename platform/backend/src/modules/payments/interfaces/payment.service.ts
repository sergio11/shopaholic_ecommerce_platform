import { CreatePaymentDto } from '../dto/create-payment.dto';

/**
 * Interface for payment service operations.
 */
export interface PaymentService {
  /**
   * Creates a payment using the provided data.
   * @param {CreatePaymentDto} data - Data for creating the payment.
   * @returns {Promise<string>} - Response containing payment information.
   */
  createPayment(data: CreatePaymentDto): Promise<string>;

  isSupportedCountry(countryCode: string): boolean;
}
