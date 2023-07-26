export class CreateOrderDto {
    idClient: number;
    idAddress: number;
    products: Array< { id: number; quantity: number; } >
}