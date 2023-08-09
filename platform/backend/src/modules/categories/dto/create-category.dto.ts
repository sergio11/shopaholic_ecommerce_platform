import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export default class CreateCategoryDTO {

    /**
     * The name of the category
     * @example 'sport'
     */
    @ApiProperty({
        description: `The name of the category`,
        example: 'sport'
    })
    @IsNotEmpty()
    @IsString()
    name: string;
    
    /**
     * The description of the category
     * @example 'Test ...'
     */
    @ApiProperty({
        description: `The description of the category`,
        example: 'Test ...'
    })
    @IsNotEmpty()
    @IsString()
    description: string;

    /**
     * The image file of the category
     */
    @ApiProperty({  description: `The image file of the category`, type: 'string', format: 'binary', required: true })
    file: Express.Multer.File
    
    @ApiHideProperty()
    image: string;

}