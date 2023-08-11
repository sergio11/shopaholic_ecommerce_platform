import { ApiProperty } from '@nestjs/swagger';
import { ProductResponseDto } from 'src/modules/products/dto/product-response.dto';

export class OrderHasProductResponseDto {

  @ApiProperty({
    description: 'Unique identifier of the order-product relationship',
    example: 'c5e1e99a-7efc-4a63-83da-5ef5e6cb6d16',
  })
  id: string;

  @ApiProperty({
    description: 'Order ID associated with the relationship',
    example: 'c5e1e99a-7efc-4a63-83da-5ef5e6cb6d16',
  })
  id_order: string;

  @ApiProperty({
    description: 'Product information',
    type: ProductResponseDto,
  })
  product: ProductResponseDto;

  @ApiProperty({
    description: 'Quantity of the product in the order',
    example: 2,
  })
  quantity: number;
}
