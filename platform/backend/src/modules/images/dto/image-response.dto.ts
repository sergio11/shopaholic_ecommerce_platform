import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { AbstractDto } from 'src/core/abstract.dto';

/**
 * Data transfer object for image response.
 */
export class ImageResponseDto extends AbstractDto {
  /**
   * URL of the image.
   * @example https://example.com/images/image.jpg
   */
  @ApiProperty({
    description: 'URL of the image',
    example: 'https://example.com/images/image.jpg',
  })
  @Expose()
  url: string;
}
