export interface Installment {
    payment_method_id:   string;
    payment_type_id:     string;
    issuer:              Issuer;
    processing_mode:     string;
    merchant_account_id: null;
    payer_costs:         PayerCost[];
    agreements:          null;
}

export interface Issuer {
    id:               string;
    name:             string;
    secure_thumbnail: string;
    thumbnail:        string;
}

export interface PayerCost {
    installments:               number;
    installment_rate:           number;
    discount_rate:              number;
    reimbursement_rate:         null;
    labels:                     string[];
    installment_rate_collector: InstallmentRateCollector[];
    min_allowed_amount:         number;
    max_allowed_amount:         number;
    recommended_message:        string;
    installment_amount:         number;
    total_amount:               number;
    payment_method_option_id:   PaymentMethodOptionID;
}

export enum InstallmentRateCollector {
    Mercadopago = "MERCADOPAGO",
    ThirdParty = "THIRD_PARTY",
}

export enum PaymentMethodOptionID {
    The1AQokODLLZjQyNjktYjAzMy00OWU1LWJhMWQtNDE0NjQyNTM3MzY4EJaFuevHLg = "1.AQokODllZjQyNjktYjAzMy00OWU1LWJhMWQtNDE0NjQyNTM3MzY4EJaFuevHLg",
}