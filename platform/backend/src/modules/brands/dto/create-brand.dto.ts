import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateImageDto } from 'src/modules/images/dto/create-image.dto';

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
    * Image file for the brand
    * @format binary
  */
  @ApiProperty({ description: 'Image file for the Brand', type: 'string', format: 'binary' })
  readonly imageFile: Express.Multer.File;

  @ApiHideProperty()
  @Exclude()
  image: CreateImageDto;
}
