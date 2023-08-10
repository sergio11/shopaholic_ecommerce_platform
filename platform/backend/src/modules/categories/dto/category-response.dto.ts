import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { AutoMap } from '@automapper/classes';
import { Expose } from 'class-transformer';

export class CategoryResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the category',
    example: 'c5e1e99a-7efc-4a63-83da-5ef5e6cb6d16',
  })
  @AutoMap()
  @IsString()
  @Expose({ name: 'category_id' })
  id: string;

  @ApiProperty({
    description: 'Name of the clothing category',
    example: 'Apparel',
  })
  @AutoMap()
  @IsString()
  @Expose({ name: 'category_name' })
  name: string;

  @ApiProperty({
    description: 'Description of the clothing category',
    example: 'A wide range of stylish clothing for all ages.',
  })
  @AutoMap()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'URL of the image for the clothing category',
    example: 'https://example.com/images/apparel.jpg',
  })
  @AutoMap()
  @IsString()
  image: string;

  @ApiProperty({
    description: 'Creation date of the clothing category',
    example: '2023-08-15T10:30:00Z',
  })
  @AutoMap()
  @Expose({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({
    description: 'Last updated date of the clothing category',
    example: '2023-08-15T14:45:00Z',
  })
  @AutoMap()
  @Expose({ name: 'updated_at' })
  updatedAt: Date;
}
