import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';


export class AddressResponseDto {
    @ApiProperty({ description: 'Unique identifier of the address' })
    @AutoMap()
    id: string;

    @ApiProperty({ description: 'Address' })
    @AutoMap()
    address: string;

    @ApiProperty({ description: 'Neighborhood' })
    @AutoMap()
    neighborhood: string;

    @ApiProperty({ description: 'User ID associated with the address' })
    @AutoMap()
    idUser: string;
}
