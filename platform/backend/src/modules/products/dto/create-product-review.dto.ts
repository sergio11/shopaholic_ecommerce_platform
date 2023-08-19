import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min, Max, IsString } from 'class-validator';

/**
 * DTO for creating a product review.
 */
export class CreateProductReviewDto {
  /**
   * Rating value
   */
  @ApiProperty({ description: 'Rating value', example: 4.5 })
  @IsNotEmpty({ message: 'Rating is required' })
  @IsNumber({}, { message: 'Rating must be a number' })
  @Min(1, { message: 'Rating must be at least 1' })
  @Max(5, { message: 'Rating must be at most 5' })
  rating: number;

  /**
   * Review text
   */
  @ApiProperty({
    description: 'Review text',
    example: 'Great product! Very satisfied.',
  })
  @IsNotEmpty({ message: 'Review text is required' })
  @IsString({ message: 'Review text must be a string' })
  reviewText: string;

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
