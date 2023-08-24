import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateAddressDto {
  /**
   * The updated address.
   */
  @ApiProperty({
    description: 'The updated address',
    example: '456 Elm Street',
  })
  @IsOptional()
  @IsString({ message: 'Address must be a string' })
  name?: string;

  /**
   * The updated neighborhood.
   */
  @ApiProperty({
    description: 'The updated neighborhood',
    example: 'Suburbia',
  })
  @IsOptional()
  @IsString({ message: 'Neighborhood must be a string' })
  neighborhood?: string;

  /**
   * The updated city.
   */
  @ApiProperty({
    description: 'The updated city',
    example: 'Updated City',
  })
  @IsOptional()
  @IsString({ message: 'City must be a string' })
  city?: string;

  /**
   * The updated state.
   */
  @ApiProperty({
    description: 'The updated state',
    example: 'Updated State',
  })
  @IsOptional()
  @IsString({ message: 'State must be a string' })
  state?: string;

  /**
   * The updated postal code.
   */
  @ApiProperty({
    description: 'The updated postal code',
    example: '54321',
  })
  @IsOptional()
  @IsString({ message: 'Postal code must be a string' })
  postalCode?: string;

  /**
   * The updated country.
   */
  @ApiProperty({
    description: 'The updated country',
    example: 'Updated Country',
  })
  @IsOptional()
  @IsString({ message: 'Country must be a string' })
  country?: string;
}
