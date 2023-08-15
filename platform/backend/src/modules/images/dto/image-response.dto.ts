import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { AbstractDto } from 'src/core/abstract.dto';


export class ImageResponseDto extends AbstractDto {
    
  @ApiProperty({
    description: 'URL of the image',
    example: 'https://example.com/images/image.jpg',
  })
  @Expose()
  url: string;

}
