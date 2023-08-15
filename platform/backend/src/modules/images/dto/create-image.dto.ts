import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

/**
 * Data transfer object for creating an image.
 */
export class CreateImageDto {

  /**
   * URL of the image
   * @example https://example.com/images/image1.jpg
   */
  @IsString()
  @ApiProperty({
    description: 'URL of the image',
    example: 'https://example.com/images/image1.jpg',
  })
  url: string;

  /**
   * ID of the storage associated with the image
   * @example c5e1e99a-7efc-4a63-83da-5ef5e6cb6d16
   */
  @IsString()
  @ApiProperty({
    description: 'ID of the storage associated with the image',
    example: 'c5e1e99a-7efc-4a63-83da-5ef5e6cb6d16',
  })
  storageId: string;
}