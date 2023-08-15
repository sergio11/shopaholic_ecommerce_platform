import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from 'src/modules/users/dto/user-response.dto';

/**
 * Data transfer object for authentication response.
 */
export class AuthResponseDto {
    /**
     * User information and roles.
     * @type {UserResponseDto}
     */
    @ApiProperty({ description: 'User information and roles', type: UserResponseDto })
    user: UserResponseDto;

    /**
     * JWT token for authentication.
     * @example Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
     * @type {string}
     */
    @ApiProperty({ description: 'JWT token', example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
    token: string;
}
