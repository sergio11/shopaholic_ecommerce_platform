import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Min, ArrayMinSize } from 'class-validator';

/**
 * Data transfer object for a cart item.
 */
class CartItemDto {
  /**
   * Product name.
   */
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Product name', example: 'Product 1' })
  name: string;

  /**
   * Product image URL.
   */
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Product image URL', example: 'product1.jpg' })
  image: string;

  /**
   * Product description.
   */
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Product description', example: 'Description of Product 1' })
  desc: string;

  /**
   * Product ID.
   */
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Product ID', example: 'product_id_1' })
  id: string;

  /**
   * Product price.
   */
  @IsInt()
  @Min(0)
  @ApiProperty({ description: 'Product price', example: 19 })
  price: number;

  /**
   * Quantity in cart.
   */
  @IsInt()
  @Min(1)
  @ApiProperty({ description: 'Quantity in cart', example: 2 })
  cartQuantity: number;
}

/**
 * Data transfer object for creating a payment.
 */
export class CreatePaymentDto {
  
  /**
   * List of cart items.
   */
  @ArrayMinSize(1)
  @ApiProperty({ type: [CartItemDto] })
  cartItems: CartItemDto[];

  /**
   * Shipping Address Id
   */
  @ApiHideProperty()
  shippingAddressId: string;

  /**
   * User ID.
   */
  @ApiHideProperty()
  userId: string;
}

