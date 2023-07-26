import { Cardholder } from "./card_holder";

export interface CardTokenBody {
    card_number:      string;
    expiration_year:  string;
    expiration_month: number;
    security_code:    string;
    cardholder:       Cardholder;
}

