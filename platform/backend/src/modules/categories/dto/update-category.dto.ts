import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

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
    
    image?: string;

}