import { ApiProperty } from '@nestjs/swagger';
import { AbstractDto } from 'src/core/abstract.dto';
import { ProductResponseDto } from 'src/modules/products/dto/product-response.dto';

/**
 * DTO for representing the relationship between an order and a product in the response.
 */
export class OrderHasProductResponseDto extends AbstractDto {

  /**
   * Order ID associated with the relationship.
   * @type {string}
   * @example 'c5e1e99a-7efc-4a63-83da-5ef5e6cb6d16'
   */
  @ApiProperty({
    description: 'Order ID associated with the relationship',
    example: 'c5e1e99a-7efc-4a63-83da-5ef5e6cb6d16',
  })
  idOrder: string;

  /**
   * Product information.
   * @type {ProductResponseDto}
   */
  @ApiProperty({
    description: 'Product information',
    type: ProductResponseDto,
  })
  product: ProductResponseDto;

  /**
   * Quantity of the product in the order.
   * @type {number}
   * @example 2
   */
  @ApiProperty({
    description: 'Quantity of the product in the order',
    example: 2,
  })
  quantity: number;
}