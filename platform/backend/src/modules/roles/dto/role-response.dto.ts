import { ApiProperty } from '@nestjs/swagger';
import { AbstractDto } from 'src/core/abstract.dto';
import { ImageResponseDto } from 'src/modules/images/dto/image-response.dto';

/**
 * DTO representing a role response.
 */
export class RoleResponseDto extends AbstractDto {

    /**
     * ID of the role.
     */
    @ApiProperty({ description: 'ID of the role' })
    id: string;

    /**
     * Name of the role.
     */
    @ApiProperty({ description: 'Name of the role' })
    name: string;

    /**
     * Image associated with the role.
     */
    @ApiProperty({ description: 'Image of the role', type: ImageResponseDto })
    image: ImageResponseDto;

    /**
     * Route associated with the role.
     */
    @ApiProperty({ description: 'Route associated with the role' })
    route: string;
}
