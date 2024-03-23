import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignInAuthDto {

    /**
     * The email of the user
     * @example 'admin@shopaholic.com'
     */
    @ApiProperty({
        description: `The email of the user`,
        example: 'admin@shopaholic.com'
    })
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;

    /**
     * The password of the user
     * @example '123456'
     */
    @ApiProperty({
        description: `The password of the user`,
        example: '123456'
    })
    @IsNotEmpty()
    @IsString()
    password: string;

}