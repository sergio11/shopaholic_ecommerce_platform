export class CreateOrderDto {
    idClient: string;
    idAddress: string;
    products: Array< { id: string; quantity: number; } >
}