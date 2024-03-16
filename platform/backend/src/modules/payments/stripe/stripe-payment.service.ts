import { Injectable } from '@nestjs/common';
import { CreatePaymentDto, ShippingAddressDto } from '../dto/create-payment.dto';
import { PaymentService } from '../interfaces/payment.service';
import { SupportService } from 'src/core/support.service';
import { I18nService } from 'nestjs-i18n';
import Stripe from 'stripe';
import { PaymentCheckoutResponseDto } from '../dto/payment-checkout-response.dto';
import { STRIPE_API_KEY } from 'src/config/config';

@Injectable()
export class StripePaymentService
  extends SupportService
  implements PaymentService
{
  private stripe: Stripe;
  private stripeSupportedCountries: Set<string> = new Set();

  /**
   * Constructs an instance of StripePaymentService.
   * @param i18n - The internationalization service.
   */
  constructor(i18n: I18nService) {
    super(i18n);
    this.stripe = new Stripe(STRIPE_API_KEY, {
      apiVersion: '2023-08-16',
    });
    this.fetchStripeSupportedCountries();
  }

  /**
   * Creates a payment session using Stripe API.
   * @param data - The data for creating the payment session.
   * @returns The payment checkout response DTO.
   */
  async createPayment(data: CreatePaymentDto): Promise<PaymentCheckoutResponseDto> {
    try {
      // Create customer in Stripe
      const customer = await this.createStripeCustomer(data);

      // Create line items for products in the cart
      const lineItems = this.createLineItems(data);

      // Create a checkout session in Stripe
      const session = await this.createStripeCheckoutSession(customer, lineItems);

      // Build payment checkout response DTO
      return this.buildPaymentCheckoutResponse(session);
    } catch (error) {
      // Handle payment error
      this.handlePaymentError(error);
    }
  }

  /**
   * Checks if a country code is supported by Stripe.
   * @param countryCode - The country code to check.
   * @returns A boolean indicating whether the country code is supported.
   */
  isSupportedCountry(countryCode: string): boolean {
    const lowercaseCountryCode = countryCode.toUpperCase();
    return this.stripeSupportedCountries.has(lowercaseCountryCode);
  }

  /**
   * Fetches supported countries from the Stripe API.
   */
  private async fetchStripeSupportedCountries() {
    const countrySpecs = await this.stripe.countrySpecs.list({ limit: 100 });
    countrySpecs.data.forEach(spec => {
      this.stripeSupportedCountries.add(spec.id.toUpperCase());
    });
    console.log("StripeSupportedCountries", this.stripeSupportedCountries);
  }

  /**
   * Creates a customer in Stripe.
   * @param data - The data for creating the customer.
   * @returns The created Stripe customer.
   */
  private async createStripeCustomer(data: CreatePaymentDto): Promise<Stripe.Customer> {
    const customerData = {
      email: data.shippingAddress.email,
      name: data.shippingAddress.fullName,
      phone: data.shippingAddress.phoneNumber,
      preferred_locales: [data.language],
      shipping: {
        name: data.shippingAddress.fullName,
        address: {
          city: data.shippingAddress.city,
          country: data.shippingAddress.country,
          postal_code: data.shippingAddress.postalCode,
          state: data.shippingAddress.state,
          line1: data.shippingAddress.line1
        },
        phone: data.shippingAddress.phoneNumber,
      },
      metadata: {
        userId: data.userId,
      }
    };
    // Create customer in Stripe
    const customer = await this.stripe.customers.create(customerData, { timeout: 5000 });
    return customer;
  }

  /**
   * Creates line items for products in the cart.
   * @param data - The data containing cart items.
   * @returns The array of line items for the checkout session.
   */
  private createLineItems(data: CreatePaymentDto): Stripe.Checkout.SessionCreateParams.LineItem[] {
    return data.cartItems.map((item: { name: any; image: any; desc: any; id: any; price: number; cartQuantity: any; }) => {
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            images: [item.image],
            description: item.desc,
            metadata: {
              id: item.id,
            },
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.cartQuantity,
      };
    });
  }

  /**
   * Creates a checkout session in Stripe.
   * @param customer - The Stripe customer associated with the checkout session.
   * @param lineItems - The line items for the checkout session.
   * @returns The created Stripe checkout session.
   */
  private async createStripeCheckoutSession(customer: Stripe.Customer, lineItems: Stripe.Checkout.SessionCreateParams.LineItem[]): Promise<Stripe.Checkout.Session> {
    // Create a checkout session in Stripe
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      customer: customer.id,
      invoice_creation: { enabled: true },
      success_url: `http://localhost:3000/api/v1/payments/checkout-success`,
      cancel_url: `http://localhost:3000/api/v1/payments/cancelled`,
    });
    return session;
  }

  /**
   * Builds the payment checkout response DTO.
   * @param session - The Stripe checkout session.
   * @returns The payment checkout response DTO.
   */
  private buildPaymentCheckoutResponse(session: Stripe.Checkout.Session): PaymentCheckoutResponseDto {
    const paymentResponse = new PaymentCheckoutResponseDto();
    paymentResponse.id = session.id;
    paymentResponse.url = session.url;
    console.log('paymentResponse', paymentResponse);
    return paymentResponse;
  }

  /**
   * Handles payment error.
   * @param error - The error object.
   */
  private handlePaymentError(error: any): void {
    if (error instanceof this.stripe.errors.StripeError) {
      console.log('Caught StripeError', error);
      // Handle the Stripe error here
    }
    this.throwInternalServerError("PAYMENT_ERROR");
  }
}
