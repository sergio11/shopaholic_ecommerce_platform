import { ApiProperty } from '@nestjs/swagger';
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
  @IsString()
  @ApiProperty({
    description: 'Name of the clothing category',
    example: 'Apparel',
  })
  name: string;

  /**
   * Description of the clothing category
   * @example A wide range of stylish clothing for all ages.
   */
  @IsString()
  @ApiProperty({
    description: 'Description of the clothing category',
    example: 'A wide range of stylish clothing for all ages.',
  })
  description: string;

  /**
   * Image of the clothing category
   */
  @ApiProperty({
    description: 'Image of the clothing category',
    type: ImageResponseDto,
  })
  image: ImageResponseDto;
}