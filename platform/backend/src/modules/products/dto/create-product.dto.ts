import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, IsUUID, Min } from 'class-validator';
import { Express } from 'express';
import { CreateImageDto } from 'src/modules/images/dto/create-image.dto';

/**
 * Data transfer object for creating a product.
 */
export class CreateProductDto {
    /**
     * Product name
     * @example Product Name
     */
    @ApiProperty({ description: 'Product name', example: 'Product Name' })
    @IsNotEmpty({ message: 'Name is required' })
    @IsString({ message: 'Name must be a string' })
    name: string;

    /**
     * Product description
     * @example Product description goes here
     */
    @ApiProperty({ description: 'Product description', example: 'Product description goes here' })
    @IsNotEmpty({ message: 'Description is required' })
    @IsString({ message: 'Description must be a string' })
    description: string;

    /**
     * Product price
     * @example 19.99
     */
    @ApiProperty({ description: 'Product price', example: 19.99 })
    @IsNotEmpty({ message: 'Price is required' })
    @IsNumber({}, { message: 'Price must be a number' })
    @Min(0, { message: 'Price must be greater than or equal to 0' })
    price: number;

    /**
     * ID of the category for the product
     * @example category_id
     */
    @ApiProperty({ description: 'ID of the category for the product', example: 'category_id' })
    @IsNotEmpty({ message: 'Category ID is required' })
    @IsUUID(undefined, { message: 'Invalid category ID format' })
    idCategory: string;

    /**
     * Image file for the main product image
     * @format binary
     */
    @ApiProperty({ description: 'Image file for the main product image', type: 'string', format: 'binary' })
    mainImageFile: Express.Multer.File;

    /**
     * Image file for the secondary product image
     * @format binary
     */
    @ApiProperty({ description: 'Image file for the secondary product image', type: 'string', format: 'binary' })
    secondaryImageFile: Express.Multer.File;

    /**
     * Hidden property for internal use.
     */
    @ApiHideProperty()
    @Exclude()
    mainImage: CreateImageDto;

    /**
     * Hidden property for internal use.
     */
    @ApiHideProperty()
    @Exclude()
    secondaryImage: CreateImageDto;
}
