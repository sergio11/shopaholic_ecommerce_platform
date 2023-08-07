import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignInAuthDto {

    /**
     * The email of the user
     * @example 'test@gmail.com1'
     */
    @ApiProperty({
        description: `The email of the user`,
        example: 'test@gmail.com'
    })
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;

    /**
     * The password of the user
     * @example '121212143'
     */
    @ApiProperty({
        description: `The password of the user`,
        example: '121212143'
    })
    @IsNotEmpty()
    @IsString()
    password: string;

}