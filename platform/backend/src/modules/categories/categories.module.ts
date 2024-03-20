import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from './category.entity';
import { CategoryMapper } from './category.mapper';
import { FilesStorageModule } from '../storage/storage.module';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity]), FilesStorageModule],
  providers: [CategoriesService, CategoryMapper],
  controllers: [CategoriesController],
  exports: [CategoriesService, CategoryMapper],
})
export class CategoriesModule {}
