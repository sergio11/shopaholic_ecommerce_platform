import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { ImageEntity } from './image.entity';
import { ImageResponseDto } from './dto/image-response.dto';

@Injectable()
export class ImageMapper {
  mapImageToResponseDto(imageEntity: ImageEntity): ImageResponseDto {
    return plainToClass(ImageResponseDto, imageEntity, { excludeExtraneousValues: true });
  }

  mapImagesToResponseDtos(imageEntities: ImageEntity[]): ImageResponseDto[] {
    return imageEntities.map(imageEntity => this.mapImageToResponseDto(imageEntity));
  }
}