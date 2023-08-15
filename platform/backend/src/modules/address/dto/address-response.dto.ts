import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { AbstractDto } from 'src/core/abstract.dto';

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
     * The user ID associated with the address.
     */
    @ApiProperty({ description: 'User ID associated with the address' })
    @Expose()
    idUser: string;
}
