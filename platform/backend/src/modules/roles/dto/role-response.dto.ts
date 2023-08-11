import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class RoleResponseDto {
    @ApiProperty({ description: 'ID of the role' })
    @Expose()
    id: string;

    @ApiProperty({ description: 'Name of the role' })
    @Expose()
    name: string;

    @ApiProperty({ description: 'Image URL of the role' })
    @Expose()
    image: string;

    @ApiProperty({ description: 'Route associated with the role' })
    @Expose()
    route: string;
}
