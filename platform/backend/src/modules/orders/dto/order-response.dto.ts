import { ApiProperty } from '@nestjs/swagger';
import { OrderHasProductResponseDto } from './order-has-product-response.dto';
import { UserResponseDto } from 'src/modules/users/dto/user-response.dto';
import { AddressResponseDto } from 'src/modules/address/dto/address-response.dto';
import { AbstractDto } from '../../../core/abstract.dto';
import { Expose } from 'class-transformer';

/**
 * DTO for representing an order in the response.
 */
export class OrderResponseDto extends AbstractDto {
  /**
   * Client information.
   * @type {UserResponseDto}
   */
  @ApiProperty({
    description: 'Client information',
    type: UserResponseDto,
  })
  @Expose()
  client: UserResponseDto;

  /**
   * Delivery address information.
   * @type {AddressResponseDto}
   */
  @ApiProperty({
    description: 'Delivery address information',
    type: AddressResponseDto,
  })
  @Expose()
  address: AddressResponseDto;

  /**
   * Status of the order.
   * @type {string}
   * @example 'PAGADO'
   */
  @ApiProperty({
    description: 'Status of the order',
    example: 'PAID',
  })
  @Expose()
  status: string;

  /**
   * Array of products in the order.
   * @type {OrderHasProductResponseDto[]}
   */
  @ApiProperty({
    description: 'Array of products in the order',
    type: [OrderHasProductResponseDto],
  })
  @Expose()
  orderHasProducts: OrderHasProductResponseDto[];

  /**
   * Total amount of the order.
   * @type {number}
   */
  @ApiProperty({
    description: 'Total amount of the order',
    example: 100.50,
  })
  @Expose()
  totalAmount: number;

  /**
   * Total number of products in the order.
   * @type {number}
   */
  @ApiProperty({
    description: 'Total number of products in the order',
    example: 5,
  })
  @Expose()
  totalProducts: number;

  /**
   * URL of the payment checkout.
   * @type {string}
   */
  @ApiProperty({
    description: 'URL of the payment checkout',
  })
  @Expose()
  paymentCheckoutUrl: string;
}
