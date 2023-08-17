// brand-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ImageResponseDto } from 'src/modules/images/dto/image-response.dto';

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
   * Image of the brand
   */
  @ApiProperty({
    description: 'Image of the brand',
    type: ImageResponseDto,
  })
  @Expose()
  image: ImageResponseDto;
}
