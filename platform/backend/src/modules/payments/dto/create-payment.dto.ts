import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Min, ArrayMinSize, IsEmail } from 'class-validator';

/**
 * Data transfer object for a cart item.
 */
export class CartItemDto {
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
 * Data transfer object for shipping address information.
 */
export class ShippingAddressDto {
  /**
   * Recipient's email address.
   */
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ description: 'Email address', example: 'customer@example.com' })
  email: string;

  /**
   * Recipient's full name.
   */
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Full name', example: 'David Lopez Fidalgo' })
  fullName: string;

  /**
   * Recipient's phone number.
   */
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Phone number', example: '+34678564567' })
  phoneNumber: string;

  /**
   * Address line 1.
   */
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Address line 1', example: '123 Main St' })
  line1: string;

  /**
   * City.
   */
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'City', example: 'Cityville' })
  city: string;

  /**
   * State or Province.
   */
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'State or Province', example: 'ST' })
  state: string;

  /**
   * Postal Code.
   */
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Postal Code', example: '12345' })
  postalCode: string;

  /**
   * Country.
   */
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Country', example: 'US' })
  country: string;
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
   * Shipping Address.
   */
  @ApiProperty({ type: ShippingAddressDto })
  shippingAddress: ShippingAddressDto;

  /**
   * User ID.
   */
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'User ID', example: '123456' })
  userId: string;
}

