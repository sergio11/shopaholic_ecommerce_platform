import { ApiProperty } from '@nestjs/swagger';
import { AbstractDto } from 'src/core/abstract.dto';

export class AddressResponseDto extends AbstractDto {

    /**
     * The address.
     */
    @ApiProperty({ description: 'Address' })
    address: string;

    /**
     * The neighborhood.
     */
    @ApiProperty({ description: 'Neighborhood' })
    neighborhood: string;

    /**
     * The user ID associated with the address.
     */
    @ApiProperty({ description: 'User ID associated with the address' })
    idUser: string;
}
