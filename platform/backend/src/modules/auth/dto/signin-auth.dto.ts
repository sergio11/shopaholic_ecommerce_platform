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
     * @example 'dsds4343dsd'
     */
    @ApiProperty({
        description: `The password of the user`,
        example: 'dsds4343dsd'
    })
    @IsNotEmpty()
    @IsString()
    password: string;

}