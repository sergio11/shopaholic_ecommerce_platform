import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from './category.entity';
import { CategoryMapper } from './category.mapper';

@Module({
  imports: [ 
    TypeOrmModule.forFeature([CategoryEntity])
  ],
  providers: [CategoriesService, CategoryMapper],
  controllers: [CategoriesController],
  exports: [CategoriesService, CategoryMapper]
})
export class CategoriesModule {}
