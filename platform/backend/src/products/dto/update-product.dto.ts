export class UpdateProductDto {

    name?: string;
    description?: string;
    price?: number;
    id_category?: number;
    image1?: string;
    image2?: string;
    images_to_update?: Array<number>;

}