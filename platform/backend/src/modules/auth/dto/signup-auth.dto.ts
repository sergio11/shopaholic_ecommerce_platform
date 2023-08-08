import { IsString, IsEmail, IsNotEmpty, MinLength } from "class-validator";
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
     * @example 'Adam'
     */
    @ApiProperty({
        description: `The lastname of the user`,
        example: 'Adam'
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
     * The roles of the user
     * @example 'CLIENT|ADMIN'
     */
    @ApiProperty({
        description: `The roles of the user`,
        example: 'CLIENT|ADMIN'
    })
    @ApiProperty({ required: false, default: [] })
    rolesName: string[];

}