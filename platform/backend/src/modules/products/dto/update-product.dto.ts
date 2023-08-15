import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { CreateImageDto } from 'src/modules/images/dto/create-image.dto';

export class UpdateProductDto {
    @ApiProperty({ description: 'Updated product name', example: 'Updated Product Name' })
    @IsOptional()
    @IsString({ message: 'Name must be a string' })
    name?: string;

    @ApiProperty({ description: 'Updated product description', example: 'Updated product description goes here' })
    @IsOptional()
    @IsString({ message: 'Description must be a string' })
    description?: string;

    @ApiProperty({ description: 'Updated product price', example: 24.99 })
    @IsOptional()
    @IsNumber({}, { message: 'Price must be a number' })
    @Min(0, { message: 'Price must be greater than or equal to 0' })
    price?: number;

    @ApiProperty({ description: 'Updated ID of the category for the product', example: 'updated_category_id' })
    @IsOptional()
    @IsUUID(undefined, { message: 'Invalid category ID format' })
    id_category?: string;

    /**
     * Image file for the main product image
     * @format binary
     */
    @ApiProperty({ description: 'Image file for the main product image', type: 'string', format: 'binary' })
    mainImageFile?: Express.Multer.File;

    /**
     * Image file for the secondary product image
     * @format binary
     */
    @ApiProperty({ description: 'Image file for the secondary product image', type: 'string', format: 'binary' })
    secondaryImageFile?: Express.Multer.File;

    /**
     * Hidden property for internal use.
     */
    @ApiHideProperty()
    @Exclude()
    mainImage?: CreateImageDto;

    /**
     * Hidden property for internal use.
     */
    @ApiHideProperty()
    @Exclude()
    secondaryImage?: CreateImageDto;

}
