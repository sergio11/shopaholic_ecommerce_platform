import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';


/**
 * Data transfer object representing the response for a payment checkout session.
 */
export class PaymentCheckoutResponseDto {
  
  /**
   * ID of the checkout session.
   */
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Checkout session id', example: '123456' })
  id: string;

  /**
   * URL of the checkout session.
   */
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Checkout session URL', example: 'https://checkout' })
  url: string;
}