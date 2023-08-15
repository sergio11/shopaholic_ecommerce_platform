import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';

export class UpdateAddressDto {

    /**
     * The updated address.
     */
    @ApiProperty({
        description: 'The updated address',
        example: '456 Elm Street',
    })
    @IsString({ message: 'Address must be a string' })
    address?: string;
    
    /**
     * The updated neighborhood.
     */
    @ApiProperty({
        description: 'The updated neighborhood',
        example: 'Suburbia',
    })
    @IsString({ message: 'Neighborhood must be a string' })
    neighborhood?: string;

    /**
     * The updated user ID associated with the address.
     */
    @ApiProperty({
        description: 'The updated user ID associated with the address',
        example: 2,
    })
    @IsNumber({}, { message: 'User ID must be a number' })
    idUser?: number;
}
