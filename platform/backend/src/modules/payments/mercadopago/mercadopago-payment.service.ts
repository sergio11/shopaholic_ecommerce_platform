import { Injectable } from '@nestjs/common';
import { PaymentService } from '../core/payment.service';
var mercadopago = require('mercadopago');

@Injectable()
export class MercadoPagoPaymentService implements PaymentService {
  constructor() {
    // Inicializa la instancia de Mercado Pago con tu clave de acceso
    mercadopago.configure({
      access_token: 'TU_CLAVE_DE_ACCESO_DE_MERCADO_PAGO',
    });
  }

  async createPayment(amount: number, currency: string, source: string): Promise<any> {
    try {
      const payment = await mercadopago.payment.create({
        transaction_amount: amount,
        currency_id: currency,
        payment_method_id: source,
      });
      return payment;
    } catch (error) {
      throw new Error('Error al crear el pago en MercadoPago');
    }
  }

  async getPayment(paymentId: string): Promise<any> {
    try {
      // Recupera un pago usando la API de MercadoPago
      const payment = await mercadopago.payment.get(paymentId);

      return payment;
    } catch (error) {
      throw new Error('Error al recuperar el pago desde MercadoPago');
    }
  }

  async getIdentificationTypes(): Promise<any> {
    try {
      // Recupera los tipos de identificación de la API de Mercado Pago
      const identificationTypes = await mercadopago.identificationTypes.list();

      return identificationTypes;
    } catch (error) {
      throw new Error('Error al recuperar los tipos de identificación desde Mercado Pago');
    }
  }

  async getInstallments(amount: number): Promise<any> {
    try {
      // Recupera las opciones de cuotas de la API de Mercado Pago
      const installments = await mercadopago.installments({
        transaction_amount: amount,
        payment_method_id: 'visa', // Método de pago (puede ser otro)
      });

      return installments;
    } catch (error) {
      throw new Error('Error al recuperar las opciones de cuotas desde Mercado Pago');
    }
  }
}