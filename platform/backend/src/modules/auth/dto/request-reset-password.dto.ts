import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RequestResetPasswordDto {
  /**
   * Email of the user requesting password reset
   */
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email of the user requesting password reset',
  })
  @IsEmail()
  email: string;
}
