import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude, Type } from 'class-transformer';
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
  @ApiProperty({
    description: 'Product name',
    example: 'Product Name',
    required: true,
    type: 'string',
  })
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  readonly name: string;

  /**
   * Product description
   * @example Product description goes here
   */
  @ApiProperty({
    description: 'Product description',
    example: 'Product description goes here',
    required: true,
    type: 'string',
  })
  @IsNotEmpty({ message: 'Description is required' })
  @IsString({ message: 'Description must be a string' })
  readonly description: string;

  /**
   * Product price
   * @example 19.99
   */
  @ApiProperty({
    description: 'Product price',
    example: 19.99,
    required: true,
    type: 'number',
  })
  @IsNotEmpty({ message: 'Price is required' })
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
  readonly price: number;

  /**
   * ID of the category for the product
   * @example category_id
   */
  @ApiProperty({
    description: 'ID of the category for the product',
    example: 'd3c28cf0-0e18-4b23-b503-2c1fecdc9bf4',
    required: true,
    type: 'string',
  })
  @IsNotEmpty({ message: 'Category ID is required' })
  @IsUUID(undefined, { message: 'Invalid category ID format' })
  readonly idCategory: string;

  /**
   * ID of the brand for the product
   * @example brand_id
   */
  @ApiProperty({
    description: 'ID of the brand for the product',
    example: 'd3c28cf0-0e18-4b23-b503-2c1fecdc9bf4',
    required: true,
    type: 'string',
  })
  @IsNotEmpty({ message: 'Brand ID is required' })
  @IsUUID(undefined, { message: 'Invalid brand ID format' })
  readonly idBrand: string;

  /**
   * Product code
   * @example PROD123
   */
  @ApiProperty({
    description: 'Product code',
    example: 'PROD123',
    required: true,
    type: 'string',
  })
  @IsNotEmpty({ message: 'Product code is required' })
  @IsString({ message: 'Product code must be a string' })
  readonly productCode: string;

  /**
   * Stock quantity
   * @example 100
   */
  @ApiProperty({
    description: 'Stock quantity',
    example: 100,
    required: true,
    type: 'number',
  })
  @IsNotEmpty({ message: 'Stock quantity is required' })
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
  readonly stock: number;

  /**
   * Image file for the main product image
   * @format binary
   */
  @ApiProperty({
    description: 'Image file for the main product image',
    type: 'string',
    format: 'binary',
  })
  readonly mainImageFile: Express.Multer.File;

  /**
   * Image file for the secondary product image
   * @format binary
   */
  @ApiProperty({
    description: 'Image file for the secondary product image',
    type: 'string',
    format: 'binary',
  })
  readonly secondaryImageFile: Express.Multer.File;

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
