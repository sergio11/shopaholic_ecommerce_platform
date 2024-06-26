import { IsString, IsEmail, IsNotEmpty, MinLength, IsOptional } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class SignUpAuthDto {
    
    /**
     * The name of the user
     * @example 'Adam'
     */
    @ApiProperty({
        description: `The name of the user`,
        example: 'Adam'
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
        example: 'Smith'
    })
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    lastname: string;

    /**
     * The email of the user
     * @example 'test@gmail.com'
     */
    @ApiProperty({
        description: `The email of the user`,
        example: 'test@gmail.com'
    })
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @IsEmail({}, { message: 'El email no es valido' })
    email: string;

    /**
     * The phone of the user
     * @example '+34685558721'
     */
    @ApiProperty({
        description: `The phone of the user`,
        example: '+34685558721'
    })
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    phone: string;

    /**
     * The password of the user (Min 6 characters)
     * @example 'dsds4343dsd'
     */
    @ApiProperty({
        description: `The password of the user (Min 6 characters)`,
        example: 'dsds4343dsd'
    })
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MinLength(6, { message: 'La contraseña debe tener minimo 6 caracteres' })
    password: string;
    
    /**
     * The country of the user
     * @example 'United States'
     */
    @ApiProperty({
        description: `The country of the user`,
        example: 'United States'
    })
    @IsNotEmpty()
    @IsString()
    country: string;

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
