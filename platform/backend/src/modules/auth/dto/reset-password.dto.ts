import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

/**
 * DTO for resetting user password.
 */
export class ResetPasswordDto {
  @ApiProperty({
    description: 'User email',
    example: 'user@example.com',
  })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({
    description: 'New password for the user',
    example: 'newPassword123',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
    message:
      'Password must be at least 8 characters long and contain at least one letter and one number',
  })
  newPassword: string;

  @ApiProperty({
    description: 'Token received for password reset',
    example: 'abc123def456',
  })
  @IsNotEmpty()
  @IsString()
  token: string;
}
