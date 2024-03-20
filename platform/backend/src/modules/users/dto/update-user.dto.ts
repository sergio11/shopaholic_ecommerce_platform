import { IsString, IsOptional } from 'class-validator';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { CreateImageDto } from 'src/modules/images/dto/create-image.dto';
import { GenderEnum } from '../gender.enum';

/**
 * Data transfer object for updating a user.
 */
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
     * The updated image file associated with the user.
     */
    @ApiProperty({ 
        description: `The updated image file associated with the user`,
        type: 'string', 
        format: 'binary' 
    })
    imageFile?: Express.Multer.File;

    /**
     * Hidden property for internal use.
     */
    @ApiHideProperty()
    @Exclude()
    image?: CreateImageDto;

    /**
     * The updated city of the user.
     */
    @ApiProperty({
        description: "The updated city of the user.",
        example: "New York",
        required: false
    })
    @IsOptional()
    @IsString()
    city?: string;

    /**
     * The updated birth date of the user.
     */
    @ApiProperty({
        description: "The updated birth date of the user.",
        example: "1990-01-01",
        required: false
    })
    @IsOptional()
    @IsString()
    birthDate?: string;

    /**
     * The updated gender of the user.
     * @enum {GenderEnum}
     */
    @ApiProperty({
        description: "The updated gender of the user.",
        enum: GenderEnum
    })
    @IsOptional()
    @IsString()
    gender?: GenderEnum;
}