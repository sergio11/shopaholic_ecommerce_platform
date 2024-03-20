import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageEntity } from './image.entity';
import { ImagesService } from './images.service';

@Module({
  imports: [ 
    TypeOrmModule.forFeature([ImageEntity])
  ],
  providers: [ImagesService],
  exports: [ImagesService]
})
export class ImagesModule {}
