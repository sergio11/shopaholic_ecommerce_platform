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
  @ApiProperty({
    description: 'Description of the product',
    example: 'A comfortable and stylish T-shirt',
  })
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
  @ApiProperty({
    description: 'Product code of the product',
    example: 'PROD123',
  })
  @Expose()
  productCode: string;

  /**
   * Brand of the product.
   */
  @ApiProperty({ description: 'Brand of the product' })
  @Expose()
  @Type(() => BrandResponseDTO)
  brand: BrandResponseDTO;

  /**
   * Number of reviews for the product.
   * @example 10
   */
  @ApiProperty({
    description: 'Number of reviews for the product',
    example: 10,
  })
  @Expose()
  numberOfReviews: number;

  /**
   * Number of times the product has been purchased.
   * @example 50
   */
  @ApiProperty({
    description: 'Number of times the product has been purchased',
    example: 50,
  })
  @Expose()
  numberOfPurchases: number;

  /**
   * Average rating of the product.
   * @example 4.5
   */
  @ApiProperty({ description: 'Average rating of the product', example: 4.5 })
  @Expose()
  averageRating: number;

  /**
   * Number of likes for the product.
   * @example 20
   */
  @ApiProperty({ description: 'Number of likes for the product', example: 20 })
  @Expose()
  likesCount: number;

  /**
   * Number of dislikes for the product.
   * @example 5
   */
  @ApiProperty({
    description: 'Number of dislikes for the product',
    example: 5,
  })
  @Expose()
  dislikesCount: number;

  /**
   * Indicates whether the product is the best rated.
   * @example true
   */
  @ApiProperty({
    description: 'Indicates whether the product is the best rated',
    example: true,
  })
  @Expose()
  isBestRated: boolean;

  /**
   * Indicates whether the product is the worst rated.
   * @example false
   */
  @ApiProperty({
    description: 'Indicates whether the product is the worst rated',
    example: false,
  })
  @Expose()
  isWorstRated: boolean;
}
