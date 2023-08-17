import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { AbstractDto } from 'src/core/abstract.dto';
import { ImageResponseDto } from 'src/modules/images/dto/image-response.dto';
import { RoleResponseDto } from 'src/modules/roles/dto/role-response.dto';
import { GenderEnum } from '../gender.enum';

/**
 * Data transfer object for user response.
 */
export class UserResponseDto extends AbstractDto {

    /**
     * User name
     * @example John
     */
    @ApiProperty({ description: 'User name', example: 'John' })
    @Expose()
    name: string;

    /**
     * User lastname
     * @example Doe
     */
    @ApiProperty({ description: 'User lastname', example: 'Doe' })
    @Expose()
    lastname: string;

    /**
     * User email
     * @example john@example.com
     */
    @ApiProperty({ description: 'User email', example: 'john@example.com' })
    @Expose()
    email: string;

    /**
     * User phone number
     * @example 1234567890
     */
    @ApiProperty({ description: 'User phone number', example: '1234567890' })
    @Expose()
    phone: string;

    /**
     * URL to user image
     * @example https://example.com/user-image.jpg
     */
    @ApiProperty({ description: 'URL to user image', example: 'https://example.com/user-image.jpg' })
    @Expose()
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
    @Expose()
    roles: RoleResponseDto[];

    /**
     * User country
     * @example United States
     */
    @ApiProperty({ description: 'User country', example: 'United States' })
    @Expose()
    country: string;

    /**
     * User preferred language
     * @example en
     */
    @ApiProperty({ description: 'User preferred language', example: 'en' })
    @Expose()
    language: string;

    /**
     * User city
     * @example New York
     */
    @ApiProperty({ description: 'User city', example: 'New York' })
    @Expose()
    city?: string;

    /**
     * User birth date
     * @example 1990-01-01
     */
    @ApiProperty({ description: 'User birth date', example: '1990-01-01' })
    @Expose()
    birthDate?: string;

    /**
     * User gender
     * @enum {GenderEnum}
     */
    @ApiProperty({ description: 'User gender', enum: GenderEnum })
    @Expose()
    gender?: GenderEnum;
}
