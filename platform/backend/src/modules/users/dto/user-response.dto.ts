import { ApiProperty } from '@nestjs/swagger';
import { AbstractDto } from 'src/core/abstract.dto';
import { ImageResponseDto } from 'src/modules/images/dto/image-response.dto';
import { RoleResponseDto } from 'src/modules/roles/dto/role-response.dto';

export class UserResponseDto extends AbstractDto {

    /**
     * User name
     * @example John
     */
    @ApiProperty({ description: 'User name', example: 'John' })
    name: string;

    /**
     * User lastname
     * @example Doe
     */
    @ApiProperty({ description: 'User lastname', example: 'Doe' })
    lastname: string;

    /**
     * User email
     * @example john@example.com
     */
    @ApiProperty({ description: 'User email', example: 'john@example.com' })
    email: string;

    /**
     * User phone number
     * @example 1234567890
     */
    @ApiProperty({ description: 'User phone number', example: '1234567890' })
    phone: string;

    /**
     * URL to user image
     * @example https://example.com/user-image.jpg
     */
    @ApiProperty({ description: 'URL to user image', example: 'https://example.com/user-image.jpg' })
    image: ImageResponseDto;

    /**
     * User roles
     * @example [{ id: '1', name: 'Admin', image: 'admin.png', route: '/admin' }]
     */
    @ApiProperty({
        description: 'User roles',
        example: [{ id: '1', name: 'Admin', image: 'admin.png', route: '/admin' }],
        type: [RoleResponseDto],
    })
    roles: RoleResponseDto[];

    /**
     * User country
     * @example United States
     */
    @ApiProperty({ description: 'User country', example: 'United States' })
    country: string;

    /**
     * User preferred language
     * @example en
     */
    @ApiProperty({ description: 'User preferred language', example: 'en' })
    language: string;
}
