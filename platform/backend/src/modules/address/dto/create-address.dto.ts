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
    address: string;
    
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
     * The user ID associated with the address.
     */
    @ApiProperty({
        description: 'The user ID associated with the address',
        example: 1,
    })
    @IsNotEmpty({ message: 'User ID is required' })
    idUser: number;
}
