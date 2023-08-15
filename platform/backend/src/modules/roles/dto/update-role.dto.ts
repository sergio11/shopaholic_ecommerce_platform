import { IsNotEmpty, IsString } from 'class-validator';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { CreateImageDto } from 'src/modules/images/dto/create-image.dto';
import { Exclude } from 'class-transformer';

/**
 * Data transfer object for updating a role.
 */
export class UpdateRoleDto {

    /**
     * The name of the role.
     */
    @ApiProperty({ example: 'ADMIN', description: 'The name of the role', required: false })
    @IsNotEmpty()
    @IsString()
    name?: string;

    /**
     * The route for the role.
     */
    @ApiProperty({ example: '/admin', description: 'The route for the role', required: false })
    @IsNotEmpty()
    @IsString()
    route?: string;

    /**
     * The image file of the category.
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
