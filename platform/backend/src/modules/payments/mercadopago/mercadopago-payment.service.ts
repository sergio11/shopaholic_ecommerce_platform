import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { PaymentService } from '../interfaces/payment.service';

@Injectable()
export class MercadoPagoPaymentService implements PaymentService {
  constructor() {
    /*mercadopago.configure({
      access_token: 'TU_CLAVE_DE_ACCESO_DE_MERCADO_PAGO',
    });*/
  }
  isSupportedCountry(countryCode: string): boolean {
    throw new Error('Method not implemented.');
  }

  async createPayment(data: CreatePaymentDto): Promise<string> {
    return '';
  }
}
