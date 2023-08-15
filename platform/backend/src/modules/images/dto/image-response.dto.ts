import { ApiProperty } from '@nestjs/swagger';
import { AbstractDto } from 'src/core/abstract.dto';


export class ImageResponseDto extends AbstractDto {
    
  @ApiProperty({
    description: 'URL of the image',
    example: 'https://example.com/images/image.jpg',
  })
  url: string;

}
