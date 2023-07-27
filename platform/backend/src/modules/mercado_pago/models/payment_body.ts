import { Identification } from "./card_holder";
import { CreateOrderDto } from '../../orders/dto/create-order.dto';

export interface PaymentBody {
    transaction_amount: number;
    token:              string;
    installments:       number;
    issuer_id:          string;
    payment_method_id:  string;
    payer:              Payer;
    order: CreateOrderDto
}

export interface Payer {
    email:          string;
    identification: Identification;
}