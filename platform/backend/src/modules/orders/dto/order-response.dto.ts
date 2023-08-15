import { ApiProperty } from '@nestjs/swagger';
import { OrderHasProductResponseDto } from './order-has-product-response.dto';
import { UserResponseDto } from 'src/modules/users/dto/user-response.dto';
import { AddressResponseDto } from 'src/modules/address/dto/address-response.dto';
import { AbstractDto } from '../../../core/abstract.dto';

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
  client: UserResponseDto;

  /**
   * Delivery address information.
   * @type {AddressResponseDto}
   */
  @ApiProperty({
    description: 'Delivery address information',
    type: AddressResponseDto,
  })
  address: AddressResponseDto;

  /**
   * Status of the order.
   * @type {string}
   * @example 'PAGADO'
   */
  @ApiProperty({
    description: 'Status of the order',
    example: 'PAGADO',
  })
  status: string;

  /**
   * Array of products in the order.
   * @type {OrderHasProductResponseDto[]}
   */
  @ApiProperty({
    description: 'Array of products in the order',
    type: [OrderHasProductResponseDto],
  })
  orderHasProducts: OrderHasProductResponseDto[];
}