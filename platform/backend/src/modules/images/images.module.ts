import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageEntity } from './image.entity';
import { ImageMapper } from './image.mapper';

@Module({
  imports: [ 
    TypeOrmModule.forFeature([ImageEntity])
  ],
  providers: [ImageMapper],
  exports: [ImageMapper]
})
export class ImagesModule {}
