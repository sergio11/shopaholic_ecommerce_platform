import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { PaymentService } from '../core/payment.service';

@Injectable()
export class StripePaymentService implements PaymentService {
  private stripe: Stripe;

  constructor() {
    // Inicializa la instancia de Stripe con tu clave secreta
    this.stripe = new Stripe('YOUR_SECRET_KEY', {
        apiVersion: '2022-11-15'
    });
  }

  async createPayment(amount: number, currency: string, paymentMethod: string): Promise<any> {
    try {
      // Crea un pago usando la API de Stripe
      const payment = await this.stripe.paymentIntents.create({
        amount,
        currency,
        payment_method: paymentMethod,
      });

      return payment;
    } catch (error) {
      throw new Error('Error al crear el pago en Stripe');
    }
  }

  async getPayment(paymentId: string): Promise<any> {
    try {
      // Recupera un pago usando la API de Stripe
      const payment = await this.stripe.paymentIntents.retrieve(paymentId);

      return payment;
    } catch (error) {
      throw new Error('Error al recuperar el pago desde Stripe');
    }
  }

  async getIdentificationTypes(): Promise<any> {
    try {
      // Recupera los tipos de identificación de la API de Stripe
      /*const identificationTypes = await this.stripe.issuing.identityDocument.listTypes();

      return identificationTypes;*/
      return null;
    } catch (error) {
      throw new Error('Error al recuperar los tipos de identificación desde Stripe');
    }
  }

  async getInstallments(paymentAmount: number, currency: string): Promise<any> {
    try {
      // Crear diferentes planes (opciones de cuotas) para el monto y la moneda especificados
      const monthlyPlan = await this.createPlan(paymentAmount, currency, 'month');
      const yearlyPlan = await this.createPlan(paymentAmount, currency, 'year');

      // Devolver las opciones de cuotas (planes) creadas
      return { monthlyPlan, yearlyPlan };
    } catch (error) {
      throw new Error('Error al obtener las opciones de cuotas desde Stripe');
    }
  }

  private async createPlan(amount: number, currency: string, interval: 'month' | 'year'): Promise<Stripe.Plan> {
    try {
      // Crear un nuevo plan en Stripe (representa una opción de cuotas)
      const plan = await this.stripe.plans.create({
        amount,
        currency,
        interval,
        product: { name: `Plan ${amount} ${currency} ${interval}` },
      });

      return plan;
    } catch (error) {
      throw new Error('Error al crear el plan en Stripe');
    }
  }
}
