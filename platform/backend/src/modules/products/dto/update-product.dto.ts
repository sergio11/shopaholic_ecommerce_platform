import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { CreateImageDto } from 'src/modules/images/dto/create-image.dto';

/**
 * Data transfer object for updating a product.
 */
export class UpdateProductDto {
    /**
     * Updated product name.
     * @example Updated Product Name
     */
    @ApiProperty({ description: 'Updated product name', example: 'Updated Product Name' })
    @IsOptional()
    @IsString({ message: 'Name must be a string' })
    name?: string;

    /**
     * Updated product description.
     * @example Updated product description goes here
     */
    @ApiProperty({ description: 'Updated product description', example: 'Updated product description goes here' })
    @IsOptional()
    @IsString({ message: 'Description must be a string' })
    description?: string;

    /**
     * Updated product price.
     * @example 24.99
     */
    @ApiProperty({ description: 'Updated product price', example: 24.99 })
    @IsOptional()
    @IsNumber({}, { message: 'Price must be a number' })
    @Min(0, { message: 'Price must be greater than or equal to 0' })
    price?: number;

    /**
     * Updated ID of the category for the product.
     * @example updated_category_id
     */
    @ApiProperty({ description: 'Updated ID of the category for the product', example: 'updated_category_id' })
    @IsOptional()
    @IsUUID(undefined, { message: 'Invalid category ID format' })
    idCategory?: string;

    /**
     * Updated ID of the brand for the product.
     * @example updated_brand_id
     */
    @ApiProperty({ description: 'Updated ID of the brand for the product', example: 'updated_brand_id' })
    @IsOptional()
    @IsUUID(undefined, { message: 'Invalid brand ID format' })
    idBrand?: string;

    /**
     * Updated product code.
     * @example UPDATED123
     */
    @ApiProperty({ description: 'Updated product code', example: 'UPDATED123' })
    @IsOptional()
    @IsString({ message: 'Product code must be a string' })
    productCode?: string;

    /**
     * Updated stock quantity.
     * @example 150
     */
    @ApiProperty({ description: 'Updated stock quantity', example: 150 })
    @IsOptional()
    @IsNumber({}, { message: 'Stock quantity must be a number' })
    @Min(0, { message: 'Stock quantity must be greater than or equal to 0' })
    stock?: number;

    /**
     * Image file for the main product image.
     * @format binary
     */
    @ApiProperty({ description: 'Image file for the main product image', type: 'string', format: 'binary' })
    mainImageFile?: Express.Multer.File;

    /**
     * Image file for the secondary product image.
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
