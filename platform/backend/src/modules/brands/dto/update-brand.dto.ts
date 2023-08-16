import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

/**
 * Data transfer object for updating a brand.
 */
export class UpdateBrandDTO {
  /**
   * Brand name
   * @example Updated Brand Name
   */
  @ApiProperty({ description: 'Brand name', example: 'Updated Brand Name' })
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  name: string;

  /**
   * Brand slug
   * @example updated-brand-slug
   */
  @ApiProperty({ description: 'Brand slug', example: 'updated-brand-slug' })
  @IsNotEmpty({ message: 'Slug is required' })
  @IsString({ message: 'Slug must be a string' })
  slug: string;

  /**
   * Brand image URL
   * @example https://example.com/updated-brand.jpg
   */
  @ApiProperty({ description: 'Brand image URL', example: 'https://example.com/updated-brand.jpg' })
  @IsNotEmpty({ message: 'Image is required' })
  @IsString({ message: 'Image must be a string' })
  image: string;
}