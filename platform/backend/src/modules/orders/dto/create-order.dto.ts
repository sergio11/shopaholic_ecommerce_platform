import {
  IsNotEmpty,
  IsArray,
  ArrayNotEmpty,
  ArrayMinSize,
  ValidateNested,
  IsUUID,
  Min,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Input structure for individual products in the order.
 */
class ProductInput {
  /**
   * ID of the product.
   */
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    description: 'ID of the product',
    example: 'ebf4a231-8a96-47f1-88b0-0ad22c0a5f78',
  })
  id: string;

  /**
   * Quantity of the product in the order.
   */
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @ApiProperty({
    description: 'Quantity of the product in the order',
    example: 2,
  })
  quantity: number;
}

/**
 * DTO for creating an order.
 */
export class CreateOrderDto {
  /**
   * ID of the client placing the order.
   */
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    description: 'ID of the client placing the order',
    example: 'c5e1e99a-7efc-4a63-83da-5ef5e6cb6d16',
  })
  idClient: string;

  /**
   * ID of the delivery address for the order.
   */
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    description: 'ID of the delivery address for the order',
    example: 'e8a6fca4-7a67-4b8b-8696-00d6c7edfa15',
  })
  idAddress: string;

  /**
   * Array of products included in the order.
   */
  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ProductInput)
  @ApiProperty({
    description: 'Array of products included in the order',
    type: [ProductInput],
  })
  products: ProductInput[];
}
