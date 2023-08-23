import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';
import { AbstractDto } from 'src/core/abstract.dto';
import { ImageResponseDto } from 'src/modules/images/dto/image-response.dto';

/**
 * Data transfer object for category response.
 */
export class CategoryResponseDto extends AbstractDto {
  /**
   * Name of the clothing category
   * @example Apparel
   */
  @ApiProperty({
    description: 'Name of the clothing category',
    example: 'Apparel',
  })
  @Expose()
  name: string;

  /**
   * Description of the clothing category
   * @example A wide range of stylish clothing for all ages.
   */
  @ApiProperty({
    description: 'Description of the clothing category',
    example: 'A wide range of stylish clothing for all ages.',
  })
  @Expose()
  description: string;

  /**
   * Image of the clothing category
   */
  @ApiProperty({
    description: 'Image of the clothing category',
    type: ImageResponseDto,
  })
  @Expose()
  image: ImageResponseDto;
}
