import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from 'src/modules/users/dto/user-response.dto';

export class AuthResponseDto {
    @ApiProperty({ description: 'User information and roles', type: UserResponseDto })
    user: UserResponseDto;

    @ApiProperty({ description: 'JWT token', example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
    token: string;
}
