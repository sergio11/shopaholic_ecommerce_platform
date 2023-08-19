import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageEntity } from './image.entity';
import { ImageMapper } from './image.mapper';
import { ImagesService } from './images.service';

@Module({
  imports: [ 
    TypeOrmModule.forFeature([ImageEntity])
  ],
  providers: [ImageMapper, ImagesService],
  exports: [ImageMapper, ImagesService]
})
export class ImagesModule {}
