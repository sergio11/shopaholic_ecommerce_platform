import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { CreateImageDto } from 'src/modules/images/dto/create-image.dto';

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
  readonly name: string;

  /**
   * Brand slug
   * @example updated-brand-slug
   */
  @ApiProperty({ description: 'Brand slug', example: 'updated-brand-slug' })
  @IsNotEmpty({ message: 'Slug is required' })
  @IsString({ message: 'Slug must be a string' })
  readonly slug: string;

  /**
   * Image file for the brand
   * @format binary
   */
  @ApiProperty({
    description: 'Image file for the Brand',
    type: 'string',
    format: 'binary',
  })
  readonly imageFile?: Express.Multer.File;

  @ApiHideProperty()
  @Exclude()
  image?: CreateImageDto;
}
