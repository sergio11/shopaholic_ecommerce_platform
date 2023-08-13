import { IsNotEmpty, IsEmail, IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({
        description: "The first name of the user.",
        example: "John"
    })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({
        description: "The last name of the user.",
        example: "Doe"
    })
    @IsNotEmpty()
    @IsString()
    lastname: string;

    @ApiProperty({
        description: "The email address of the user.",
        example: "john@example.com"
    })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({
        description: "The phone number of the user.",
        example: "1234567890"
    })
    @IsNotEmpty()
    @IsString()
    phone: string;

    @ApiProperty({
        description: "The password for the user's account.",
        example: "mysecurepassword"
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password: string;

    @ApiProperty({
        description: "URL of the user's profile image.",
        example: "https://example.com/profile.jpg",
        required: false
    })
    @IsOptional()
    @IsString()
    image?: string;

    @ApiProperty({
        description: "Token used for push notifications.",
        example: "f1d8e9c0-1234-5678-9abc-0def1ab234cd",
        required: false
    })
    @IsOptional()
    @IsString()
    notification_token?: string;

    @ApiProperty({
        description: "The country where the user is located.",
        example: "United States"
    })
    @IsNotEmpty()
    @IsString()
    country: string;

    @ApiProperty({
        description: "The preferred language of the user.",
        example: "en"
    })
    @IsNotEmpty()
    @IsString()
    language: string;
}
