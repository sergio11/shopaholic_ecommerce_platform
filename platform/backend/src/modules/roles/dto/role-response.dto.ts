import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { AbstractDto } from 'src/core/abstract.dto';
import { ImageResponseDto } from 'src/modules/images/dto/image-response.dto';

/**
 * DTO representing a role response.
 */
export class RoleResponseDto extends AbstractDto {

    /**
     * Name of the role.
     */
    @ApiProperty({ description: 'Name of the role' })
    @Expose()
    name: string;

    /**
     * Image associated with the role.
     */
    @ApiProperty({ description: 'Image of the role', type: ImageResponseDto })
    @Expose()
    image: ImageResponseDto;

    /**
     * Route associated with the role.
     */
    @ApiProperty({ description: 'Route associated with the role' })
    @Expose()
    route: string;
}
