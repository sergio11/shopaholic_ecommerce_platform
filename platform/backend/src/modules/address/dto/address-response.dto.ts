import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { AbstractDto } from 'src/core/abstract.dto';
import { UserResponseDto } from 'src/modules/users/dto/user-response.dto';

export class AddressResponseDto extends AbstractDto {
  /**
   * The address.
   */
  @ApiProperty({ description: 'Address' })
  @Expose()
  address: string;

  /**
   * The neighborhood.
   */
  @ApiProperty({ description: 'Neighborhood' })
  @Expose()
  neighborhood: string;

  /**
   * The city.
   */
  @ApiProperty({ description: 'City' })
  @Expose()
  city: string;

  /**
   * The state.
   */
  @ApiProperty({ description: 'State' })
  @Expose()
  state: string;

  /**
   * The postal code.
   */
  @ApiProperty({ description: 'Postal code' })
  @Expose()
  postalCode: string;

  /**
   * The country.
   */
  @ApiProperty({ description: 'Country' })
  @Expose()
  country: string;

  /**
   * The user associated with the address.
   */
  @ApiProperty({ description: 'User associated with the address' })
  @Expose()
  user: UserResponseDto;
}
