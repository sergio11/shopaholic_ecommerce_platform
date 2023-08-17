import { IsNotEmpty, IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { CreateImageDto } from 'src/modules/images/dto/create-image.dto';
import { Exclude } from 'class-transformer';
import { GenderEnum } from '../gender.enum';

export class CreateUserDto {
    /**
     * The first name of the user.
     */
    @ApiProperty({
        description: "The first name of the user.",
        example: "John"
    })
    @IsNotEmpty()
    @IsString()
    name: string;

    /**
     * The last name of the user.
     */
    @ApiProperty({
        description: "The last name of the user.",
        example: "Doe"
    })
    @IsNotEmpty()
    @IsString()
    lastname: string;

    /**
     * The email address of the user.
     */
    @ApiProperty({
        description: "The email address of the user.",
        example: "john@example.com"
    })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    /**
     * The phone number of the user.
     */
    @ApiProperty({
        description: "The phone number of the user.",
        example: "1234567890"
    })
    @IsOptional()
    @IsString()
    phone: string;

    /**
     * The password for the user's account.
     */
    @ApiProperty({
        description: "The password for the user's account.",
        example: "mysecurepassword"
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password: string;

    /**
     * Token used for push notifications.
     */
    @ApiProperty({
        description: "Token used for push notifications.",
        example: "f1d8e9c0-1234-5678-9abc-0def1ab234cd",
        required: false
    })
    @IsOptional()
    @IsString()
    notificationToken?: string;

    /**
     * The birth date of the user
     */
    @ApiProperty({
        description: "The birth date of the user.",
        example: "1990-01-01",
        required: false
    })
    @IsOptional()
    @IsString()
    birthDate?: string;

    /**
     * The gender of the user.
     */
    @ApiProperty({
        description: "The gender of the user.",
        enum: GenderEnum,
        required: false
    })
    @IsOptional()
    @IsEnum(GenderEnum, { message: 'Invalid gender' })
    gender?: GenderEnum;

    /**
     * The city where the user is located.
     */
    @ApiProperty({
        description: "The city where the user is located.",
        example: "New York",
        required: false
    })
    @IsOptional()
    @IsString()
    city?: string;

    /**
     * The country where the user is located.
     */
    @ApiProperty({
        description: "The country where the user is located.",
        example: "United States",
        required: false
    })
    @IsOptional()
    @IsString()
    country?: string;

    /**
     * The preferred language of the user.
     */
    @ApiProperty({
        description: "The preferred language of the user.",
        example: "en",
        required: false
    })
    @IsOptional()
    @IsString()
    language?: string;

    /**
     * The image file associated with the user.
     */
    @ApiProperty({  description: `The image file associated with the user`, type: 'string', format: 'binary' })
    imageFile: Express.Multer.File;
    
    /**
     * Hidden property for internal use.
     */
    @ApiHideProperty()
    @Exclude()
    image: CreateImageDto;
}