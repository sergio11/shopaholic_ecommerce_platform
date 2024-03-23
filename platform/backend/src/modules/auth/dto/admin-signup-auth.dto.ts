import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

/**
 * DTO for admin signup.
 */
export class AdminSignUpAuthDto {
  /**
   * The name of the user
   * @example 'Adam'
   */
  @ApiProperty({
    description: `The name of the user`,
    example: 'Adam',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  /**
   * The lastname of the user
   * @example 'Smith'
   */
  @ApiProperty({
    description: `The lastname of the user`,
    example: 'Smith',
  })
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  lastname: string;

  /**
   * The email of the user
   * @example 'admin@shopaholic.com'
   */
  @ApiProperty({
    description: `The email of the user`,
    example: 'admin@shopaholic.com',
  })
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email should not be empty' })
  email: string;

  /**
   * The password of the user (Min 6 characters)
   * @example '123456'
   */
  @ApiProperty({
    description: `The password of the user (Min 6 characters)`,
    example: '123456',
  })
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener minimo 6 caracteres' })
  password: string;

  /**
   * The preferred language of the user (optional)
   * @example 'en'
   */
  @ApiProperty({
    description: `The preferred language of the user`,
    example: 'en',
    required: false,
  })
  @IsOptional()
  @IsString()
  language?: string;
}
