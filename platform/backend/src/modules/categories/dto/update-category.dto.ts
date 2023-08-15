import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";
import { CreateImageDto } from "src/modules/images/dto/create-image.dto";

export default class UpdateCategoryDTO {

    /**
     * The name of the category
     * @example 'sport'
     */
    @ApiProperty({
        description: `The new name of the category`,
        example: 'sport'
    })
    @IsNotEmpty()
    @IsString()
    name?: string;

    /**
     * The new description of the category
     * @example 'Test ...'
     */
    @ApiProperty({
        description: `The new description of the category`,
        example: 'Test ...'
    })
    @IsNotEmpty()
    @IsString()
    description?: string;
    
    /**
     * The image file of the category
     */
    @ApiProperty({  description: `The image file of the category`, type: 'string', format: 'binary' })
    imageFile?: Express.Multer.File;
    
    @ApiHideProperty()
    @Exclude()
    image?: CreateImageDto;

}