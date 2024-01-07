import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAddressDto {
  /**
   * The address.
   */
  @ApiProperty({
    description: 'The address',
    example: '123 Main Street',
  })
  @IsNotEmpty({ message: 'Address is required' })
  @IsString({ message: 'Address must be a string' })
  name: string;

  /**
   * The neighborhood.
   */
  @ApiProperty({
    description: 'The neighborhood',
    example: 'Downtown',
  })
  @IsNotEmpty({ message: 'Neighborhood is required' })
  @IsString({ message: 'Neighborhood must be a string' })
  neighborhood: string;

  /**
   * The city.
   */
  @ApiProperty({
    description: 'The city',
    example: 'New York',
  })
  @IsNotEmpty({ message: 'City is required' })
  @IsString({ message: 'City must be a string' })
  city: string;

  /**
   * The state.
   */
  @ApiProperty({
    description: 'The state',
    example: 'California',
  })
  @IsNotEmpty({ message: 'State is required' })
  @IsString({ message: 'State must be a string' })
  state: string;

  /**
   * The postal code.
   */
  @ApiProperty({
    description: 'The postal code',
    example: '12345',
  })
  @IsNotEmpty({ message: 'Postal code is required' })
  @IsString({ message: 'Postal code must be a string' })
  postalCode: string;

  /**
   * The country.
   */
  @ApiProperty({
    description: 'The country',
    example: 'United States',
  })
  @IsNotEmpty({ message: 'Country is required' })
  @IsString({ message: 'Country must be a string' })
  country: string;
}
