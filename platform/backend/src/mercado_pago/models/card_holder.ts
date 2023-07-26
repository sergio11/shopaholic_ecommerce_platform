export interface Cardholder {
    identification: Identification;
    name: string;
}

export interface Identification {
    number: string;
    type:   string;
}
