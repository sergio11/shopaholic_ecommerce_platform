// brand-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

/**
 * Data transfer object for brand response.
 */
export class BrandResponseDTO {

  /**
   * Unique identifier of the brand.
   * @example c5e1e99a-7efc-4a63-83da-5ef5e6cb6d16
   */
  @ApiProperty({
    description: 'Unique identifier of the brand',
    example: 'c5e1e99a-7efc-4a63-83da-5ef5e6cb6d16',
  })
  @Expose()
  id: string;

  /**
   * Name of the brand.
   * @example Nike
   */
  @ApiProperty({
    description: 'Name of the brand',
    example: 'Nike',
  })
  @Expose()
  name: string;

  /**
   * Slug of the brand.
   * @example nike
   */
  @ApiProperty({
    description: 'Slug of the brand',
    example: 'nike',
  })
  @Expose()
  slug: string;

  /**
   * Image URL of the brand.
   * @example https://example.com/nike-logo.png
   */
  @ApiProperty({
    description: 'Image URL of the brand',
    example: 'https://example.com/nike-logo.png',
  })
  @Expose()
  image: string;
}
