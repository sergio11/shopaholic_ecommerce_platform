import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

/**
 * Data transfer object for creating a brand.
 */
export class CreateBrandDTO {
  /**
   * Brand name
   * @example Brand Name
   */
  @ApiProperty({ description: 'Brand name', example: 'Brand Name' })
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  name: string;

  /**
   * Brand slug
   * @example brand-slug
   */
  @ApiProperty({ description: 'Brand slug', example: 'brand-slug' })
  @IsNotEmpty({ message: 'Slug is required' })
  @IsString({ message: 'Slug must be a string' })
  slug: string;

  /**
   * Brand image URL
   * @example https://example.com/brand.jpg
   */
  @ApiProperty({ description: 'Brand image URL', example: 'https://example.com/brand.jpg' })
  @IsNotEmpty({ message: 'Image is required' })
  @IsString({ message: 'Image must be a string' })
  image: string;
}
