import { ApiProperty } from '@nestjs/swagger';
import { RoleResponseDto } from "src/modules/roles/dto/role-response.dto";

export class UserResponseDto {
    @ApiProperty({ description: 'User ID', example: '1' })
    id: string;

    @ApiProperty({ description: 'User name', example: 'John' })
    name: string;

    @ApiProperty({ description: 'User lastname', example: 'Doe' })
    lastname: string;

    @ApiProperty({ description: 'User email', example: 'john@example.com' })
    email: string;

    @ApiProperty({ description: 'User phone number', example: '1234567890' })
    phone: string;

    @ApiProperty({ description: 'URL to user image', example: 'https://example.com/user-image.jpg' })
    image: string;

    @ApiProperty({ description: 'Notification token', example: 'xyz123abc456' })
    notificationToken: string;

    @ApiProperty({
        description: 'User roles',
        example: [{ id: '1', name: 'Admin', image: 'admin.png', route: '/admin' }],
        type: [RoleResponseDto],
    })
    roles: RoleResponseDto[];

    @ApiProperty({ description: 'User country', example: 'United States' })
    country: string;

    @ApiProperty({ description: 'User preferred language', example: 'en' })
    language: string;
}
