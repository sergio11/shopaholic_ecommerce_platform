export class CreateOrderDto {
    id_client: number;
    id_address: number;
    products: Array< { id: number; quantity: number; } >
}