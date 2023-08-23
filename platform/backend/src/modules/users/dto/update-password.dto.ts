import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO for updating user password.
 */
export class UpdatePasswordDto {
  /**
   * The current password of the user.
   * @example 'currentPassword123'
   */
  @ApiProperty({
    description: 'The current password of the user',
    example: 'currentPassword123',
  })
  @IsString()
  @MinLength(6)
  currentPassword: string;

  /**
   * The new password for the user.
   * @example 'newPassword456'
   */
  @ApiProperty({
    description: 'The new password for the user',
    example: 'newPassword456',
  })
  @IsString()
  @MinLength(6)
  newPassword: string;
}
