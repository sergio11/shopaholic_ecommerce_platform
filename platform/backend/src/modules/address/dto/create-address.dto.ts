import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

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
     * The user ID associated with the address.
     */
    @ApiProperty({ description: 'The user ID associated with the address', example: 'd3c28cf0-0e18-4b23-b503-2c1fecdc9bf4' })
    @IsNotEmpty({ message: 'User ID is required' })
    @IsUUID(undefined, { message: 'Invalid User ID format' })
    idUser: string;
}
