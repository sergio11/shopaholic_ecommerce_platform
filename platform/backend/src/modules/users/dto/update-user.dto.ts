import { IsString, IsOptional } from 'class-validator';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { CreateImageDto } from 'src/modules/images/dto/create-image.dto';

export class UpdateUserDto {
    /**
     * The updated first name of the user.
     */
    @ApiProperty({
        description: "The updated first name of the user.",
        example: "John"
    })
    @IsOptional()
    @IsString()
    name?: string;

    /**
     * The updated last name of the user.
     */
    @ApiProperty({
        description: "The updated last name of the user.",
        example: "Doe"
    })
    @IsOptional()
    @IsString()
    lastname?: string;

    /**
     * The updated phone number of the user.
     */
    @ApiProperty({
        description: "The updated phone number of the user.",
        example: "1234567890"
    })
    @IsOptional()
    @IsString()
    phone?: string;

    /**
     * The updated token used for push notifications.
     */
    @ApiProperty({
        description: "The updated token used for push notifications.",
        example: "f1d8e9c0-1234-5678-9abc-0def1ab234cd",
        required: false
    })
    @IsOptional()
    @IsString()
    notification_token?: string;

    /**
     * The updated country of the user.
     */
    @ApiProperty({
        description: "The updated country of the user.",
        example: "United States",
        required: false
    })
    @IsOptional()
    @IsString()
    country?: string;

    /**
     * The updated preferred language of the user.
     */
    @ApiProperty({
        description: "The updated preferred language of the user.",
        example: "en",
        required: false
    })
    @IsOptional()
    @IsString()
    language?: string;

    /**
     * The image file associated with the role.
     */
    @ApiProperty({  description: `The image file associated with the role`, type: 'string', format: 'binary' })
    imageFile?: Express.Multer.File;
    
    /**
     * Hidden property for internal use.
     */
    @ApiHideProperty()
    @Exclude()
    image?: CreateImageDto;
}