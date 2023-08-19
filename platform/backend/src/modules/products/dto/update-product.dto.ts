import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude, Type } from 'class-transformer';
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
  @ApiProperty({
    description: 'Updated product name',
    example: 'Updated Product Name',
    required: false,
    type: 'string',
  })
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  readonly name?: string;

  /**
   * Updated product description.
   * @example Updated product description goes here
   */
  @ApiProperty({
    description: 'Updated product description',
    example: 'Updated product description goes here',
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  readonly description?: string;

  /**
   * Updated product price.
   * @example 24.99
   */
  @ApiProperty({ description: 'Updated product price', example: 24.99 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber(
    {
      allowNaN: false,
      allowInfinity: false,
      maxDecimalPlaces: 2,
    },
    { message: 'Price must be a number' },
  )
  @Min(0.0, { message: 'Price must be greater than or equal to 0' })
  readonly price?: number;

  /**
   * Updated ID of the category for the product.
   * @example updated_category_id
   */
  @ApiProperty({
    description: 'Updated ID of the category for the product',
    example: 'updated_category_id',
  })
  @IsOptional()
  @IsUUID(undefined, { message: 'Invalid category ID format' })
  readonly idCategory?: string;

  /**
   * Updated ID of the brand for the product.
   * @example updated_brand_id
   */
  @ApiProperty({
    description: 'Updated ID of the brand for the product',
    example: 'updated_brand_id',
  })
  @IsOptional()
  @IsUUID(undefined, { message: 'Invalid brand ID format' })
  readonly idBrand?: string;

  /**
   * Updated product code.
   * @example UPDATED123
   */
  @ApiProperty({ description: 'Updated product code', example: 'UPDATED123' })
  @IsOptional()
  @IsString({ message: 'Product code must be a string' })
  readonly productCode?: string;

  /**
   * Updated stock quantity.
   * @example 150
   */
  @ApiProperty({ description: 'Updated stock quantity', example: 150 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber(
    {
      allowNaN: false,
      allowInfinity: false,
      maxDecimalPlaces: 0,
    },
    { message: 'Stock quantity must be a number' },
  )
  @Min(0, { message: 'Stock quantity must be greater than or equal to 0' })
  readonly stock?: number;

  /**
   * Image file for the main product image.
   * @format binary
   */
  @ApiProperty({
    description: 'Image file for the main product image',
    type: 'string',
    format: 'binary',
  })
  readonly mainImageFile?: Express.Multer.File;

  /**
   * Image file for the secondary product image.
   * @format binary
   */
  @ApiProperty({
    description: 'Image file for the secondary product image',
    type: 'string',
    format: 'binary',
  })
  readonly secondaryImageFile?: Express.Multer.File;

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
