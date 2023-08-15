import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';
import { AbstractDto } from 'src/core/abstract.dto';
import { CategoryResponseDto } from 'src/modules/categories/dto/category-response.dto';
import { ImageResponseDto } from 'src/modules/images/dto/image-response.dto';

/**
 * Data transfer object for product response.
 */
export class ProductResponseDto extends AbstractDto {
    
    /**
     * Name of the product
     * @example T-shirt
     */
    @ApiProperty({ description: 'Name of the product', example: 'T-shirt' })
    @Expose()
    @IsString()
    name: string;

    /**
     * Description of the product
     * @example A comfortable and stylish T-shirt
     */
    @ApiProperty({ description: 'Description of the product', example: 'A comfortable and stylish T-shirt' })
    @Expose()
    @IsString()
    description: string;

    /**
     * Main image of the product
     */
    @ApiProperty({ description: 'Main image of the product' })
    @Expose({ name: 'main_image' })
    @Type(() => ImageResponseDto)
    mainImage: ImageResponseDto;

    /**
     * Secondary image of the product
     */
    @ApiProperty({ description: 'Secondary image of the product' })
    @Expose({ name: 'secondary_image' })
    @Type(() => ImageResponseDto)
    secondaryImage: ImageResponseDto;

    /**
     * Category of the product
     */
    @ApiProperty({ description: 'Category of the product' })
    @Expose()
    @Type(() => CategoryResponseDto)
    category: CategoryResponseDto;

    /**
     * Price of the product
     * @example 25.99
     */
    @ApiProperty({ description: 'Price of the product', example: 25.99 })
    @Expose()
    @IsNumber()
    price: number;
}
