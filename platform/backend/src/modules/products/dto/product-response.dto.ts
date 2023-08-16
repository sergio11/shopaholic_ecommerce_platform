import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { AbstractDto } from 'src/core/abstract.dto';
import { BrandResponseDTO } from 'src/modules/brands/dto/brand-response.dto';
import { CategoryResponseDto } from 'src/modules/categories/dto/category-response.dto';
import { ImageResponseDto } from 'src/modules/images/dto/image-response.dto';

/**
 * Data transfer object for product response.
 */
export class ProductResponseDto extends AbstractDto {
    /**
     * Name of the product.
     * @example T-shirt
     */
    @ApiProperty({ description: 'Name of the product', example: 'T-shirt' })
    @Expose()
    name: string;

    /**
     * Description of the product.
     * @example A comfortable and stylish T-shirt
     */
    @ApiProperty({ description: 'Description of the product', example: 'A comfortable and stylish T-shirt' })
    @Expose()
    description: string;

    /**
     * Main image of the product.
     */
    @ApiProperty({ description: 'Main image of the product' })
    @Expose()
    @Type(() => ImageResponseDto)
    mainImage: ImageResponseDto;

    /**
     * Secondary image of the product.
     */
    @ApiProperty({ description: 'Secondary image of the product' })
    @Expose()
    @Type(() => ImageResponseDto)
    secondaryImage: ImageResponseDto;

    /**
     * Category of the product.
     */
    @ApiProperty({ description: 'Category of the product' })
    @Expose()
    @Type(() => CategoryResponseDto)
    category: CategoryResponseDto;

    /**
     * Price of the product.
     * @example 25.99
     */
    @ApiProperty({ description: 'Price of the product', example: 25.99 })
    @Expose()
    price: number;

    /**
     * Stock of the product.
     * @example 100
     */
    @ApiProperty({ description: 'Stock of the product', example: 100 })
    @Expose()
    stock: number;

    /**
     * Product code of the product.
     * @example PROD123
     */
    @ApiProperty({ description: 'Product code of the product', example: 'PROD123' })
    @Expose()
    productCode: string;

    /**
     * Brand of the product.
     */
    @ApiProperty({ description: 'Brand of the product' })
    @Expose()
    @Type(() => BrandResponseDTO)
    brand: BrandResponseDTO;
}