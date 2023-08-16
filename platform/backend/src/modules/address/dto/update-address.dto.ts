import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateAddressDto {

    /**
     * The updated address.
     */
    @ApiProperty({
        description: 'The updated address',
        example: '456 Elm Street',
    })
    @IsString({ message: 'Address must be a string' })
    name?: string;
    
    /**
     * The updated neighborhood.
     */
    @ApiProperty({
        description: 'The updated neighborhood',
        example: 'Suburbia',
    })
    @IsString({ message: 'Neighborhood must be a string' })
    neighborhood?: string;
}
