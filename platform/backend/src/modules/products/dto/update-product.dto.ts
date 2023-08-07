export class UpdateProductDto {

    name?: string;
    description?: string;
    price?: number;
    id_category?: string;
    image1?: string;
    image2?: string;
    images_to_update?: Array<number>;

}