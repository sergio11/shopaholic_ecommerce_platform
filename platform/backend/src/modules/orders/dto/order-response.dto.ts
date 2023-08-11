import { ApiProperty } from '@nestjs/swagger';
import { OrderHasProductResponseDto } from './order-has-product-response.dto';

export class OrderResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the order',
    example: 'c5e1e99a-7efc-4a63-83da-5ef5e6cb6d16',
  })
  id: string;

  @ApiProperty({
    description: 'Unique identifier of the client',
    example: 'c5e1e99a-7efc-4a63-83da-5ef5e6cb6d16',
  })
  idClient: string;

  @ApiProperty({
    description: 'Unique identifier of the address',
    example: 'c5e1e99a-7efc-4a63-83da-5ef5e6cb6d16',
  })
  idAddress: string;

  @ApiProperty({
    description: 'Status of the order',
    example: 'PAGADO',
  })
  status: string;

  @ApiProperty({
    description: 'Array of products in the order',
    type: [OrderHasProductResponseDto],
  })
  orderHasProducts: OrderHasProductResponseDto[];
}
