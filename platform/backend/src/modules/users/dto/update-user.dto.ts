import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
    @ApiProperty({
        description: "The updated first name of the user.",
        example: "John"
    })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({
        description: "The updated last name of the user.",
        example: "Doe"
    })
    @IsOptional()
    @IsString()
    lastname?: string;

    @ApiProperty({
        description: "The updated phone number of the user.",
        example: "1234567890"
    })
    @IsOptional()
    @IsString()
    phone?: string;

    @ApiProperty({
        description: "The updated URL of the user's profile image.",
        example: "https://example.com/profile.jpg",
        required: false
    })
    @IsOptional()
    @IsString()
    image?: string;

    @ApiProperty({
        description: "The updated token used for push notifications.",
        example: "f1d8e9c0-1234-5678-9abc-0def1ab234cd",
        required: false
    })
    @IsOptional()
    @IsString()
    notification_token?: string;

    @ApiProperty({
        description: "The updated country of the user.",
        example: "United States",
        required: false
    })
    @IsOptional()
    @IsString()
    country?: string;

    @ApiProperty({
        description: "The updated preferred language of the user.",
        example: "en",
        required: false
    })
    @IsOptional()
    @IsString()
    language?: string;
}
