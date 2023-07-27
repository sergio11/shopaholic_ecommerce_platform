import { HttpService } from '@nestjs/axios/dist';
import { Injectable, HttpException } from '@nestjs/common';
import { AxiosResponse, AxiosError } from 'axios';
import { Observable, catchError, map } from 'rxjs';
import { MERCADO_PAGO_API } from 'src/config/config';
import { IdentificationType } from './models/identification_type';
import { MERCADO_PAGO_HEADERS } from 'src/config/config';
import { Installment } from './models/installment';
import { CardTokenBody } from './models/card_token_body';
import { CardTokenResponse } from './models/card_token_response';
import { PaymentResponse } from './models/payment_response';
import { PaymentBody } from './models/payment_body';
import { Repository } from 'typeorm';
import { Order } from 'src/modules/orders/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderHasProducts } from '../orders/order_has_products.entity';

@Injectable()
export class MercadoPagoService {

    constructor(
        private readonly httpService: HttpService,
        @InjectRepository(Order) private ordersRepository: Repository<Order>,
        @InjectRepository(OrderHasProducts) private ordersHasProductsRepository: Repository<OrderHasProducts>,
    ) {}

    getIdentificationTypes(): Observable<AxiosResponse<IdentificationType[]>> {
        return this.httpService.get(MERCADO_PAGO_API + '/identification_types', { headers: MERCADO_PAGO_HEADERS }).pipe(
            catchError((error: AxiosError) => {
                throw new HttpException(error.response.data, error.response.status);
            })
        ).pipe(map((resp) => resp.data));
    }

    getInstallments(firstSixDigits: number, amount: number): Observable<Installment> {
        return this.httpService.get(MERCADO_PAGO_API + `/payment_methods/installments?bin=${firstSixDigits}&amount=${amount}`, { headers: MERCADO_PAGO_HEADERS }).pipe(
            catchError((error: AxiosError) => {
                throw new HttpException(error.response.data, error.response.status);
            })
        ).pipe(map((resp: AxiosResponse<Installment>) => resp.data[0]));
    }

    createCardToken(cardTokenBody: CardTokenBody): Observable<CardTokenResponse> {
        return this.httpService.post(
            MERCADO_PAGO_API + `/card_tokens?public_key=TEST-8568eec6-7fc0-48dc-b15a-d6a9278057e1`,
            cardTokenBody, 
            { headers: MERCADO_PAGO_HEADERS }
        ).pipe(
            catchError((error: AxiosError) => {
                throw new HttpException(error.response.data, error.response.status);
            })
        ).pipe(map((resp: AxiosResponse<CardTokenResponse>) => resp.data));
    }
    
    async createPayment(paymentBody: PaymentBody): Promise<Observable<PaymentResponse>> {
        const newOrder = await this.ordersRepository.create(paymentBody.order);
        const savedOrder = await this.ordersRepository.save(newOrder);

        for (const product of paymentBody.order.products) {
            const ohp = new OrderHasProducts();
            ohp.id_order = savedOrder.id;
            ohp.idProduct = product.id;
            ohp.quantity = product.quantity;
            await this.ordersHasProductsRepository.save(ohp);
        }
        
        delete paymentBody.order;

        return this.httpService.post(
            MERCADO_PAGO_API + '/payments',
            paymentBody, 
            { headers: MERCADO_PAGO_HEADERS }
        ).pipe(
            catchError((error: AxiosError) => {
                throw new HttpException(error.response.data, error.response.status);
            })
        ).pipe(map((resp: AxiosResponse<PaymentResponse>) => resp.data));
    }


}
