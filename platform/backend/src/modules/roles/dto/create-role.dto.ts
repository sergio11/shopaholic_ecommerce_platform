import { IsNotEmpty, IsString } from "class-validator";
import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { CreateImageDto } from "src/modules/images/dto/create-image.dto";
import { Exclude } from "class-transformer";

/**
 * Data transfer object for creating a new role.
 */
export class CreateRoleDto {

    /**
     * Unique identifier for the role.
     */
    @ApiProperty({ description: 'Unique identifier for the role', example: 'admin' })
    @IsNotEmpty()
    @IsString()
    id: string;

    /**
     * Name of the role.
     */
    @ApiProperty({ description: 'Name of the role', example: 'Administrator' })
    @IsNotEmpty()
    @IsString()
    name: string;

    /**
     * Route associated with the role.
     */
    @ApiProperty({ description: 'Route associated with the role', example: '/admin' })
    @IsNotEmpty()
    @IsString()
    route: string;

    /**
     * The image file of the category.
     */
    @ApiProperty({  description: `The image file associated with the role`, type: 'string', format: 'binary' })
    imageFile: Express.Multer.File;
    
    /**
     * Hidden property for internal use.
     */
    @ApiHideProperty()
    @Exclude()
    image: CreateImageDto;
}
