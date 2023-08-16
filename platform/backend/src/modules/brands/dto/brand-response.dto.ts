// brand-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class BrandResponseDTO {
  @ApiProperty({
    description: 'Unique identifier of the brand',
    example: 'c5e1e99a-7efc-4a63-83da-5ef5e6cb6d16',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Name of the brand',
    example: 'Nike',
  })
  name: string;

  @ApiProperty({
    description: 'Slug of the brand',
    example: 'nike',
  })
  slug: string;

  @ApiProperty({
    description: 'Image URL of the brand',
    example: 'https://example.com/nike-logo.png',
  })
  image: string;
}
