import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from './category.entity';
import { CategoryProfile } from './category.mapper';

@Module({
  imports: [ 
    TypeOrmModule.forFeature([CategoryEntity])
  ],
  providers: [
    CategoriesService, 
    CategoryProfile
  ],
  controllers: [CategoriesController]
})
export class CategoriesModule {}
