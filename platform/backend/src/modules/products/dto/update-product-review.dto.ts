import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min, Max, IsString, IsOptional } from 'class-validator';

/**
 * DTO for updating a product review.
 */
export class UpdateProductReviewDto {
  /**
   * Updated rating value
   */
  @ApiProperty({ description: 'Updated rating value', example: 4.8 })
  @IsOptional()
  @IsNumber({}, { message: 'Rating must be a number' })
  @Min(1, { message: 'Rating must be at least 1' })
  @Max(5, { message: 'Rating must be at most 5' })
  rating?: number;

  /**
   * Updated review text
   */
  @ApiProperty({
    description: 'Updated review text',
    example: 'Really enjoying the product!',
  })
  @IsOptional()
  @IsString({ message: 'Review text must be a string' })
  reviewText?: string;

  /**
   * User id
   */
  @ApiHideProperty()
  idUser: string;

  /**
   * Product id
   */
  @ApiHideProperty()
  idProduct: string;
}
