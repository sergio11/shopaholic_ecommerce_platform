import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { CategoryEntity } from './category.entity';
import { CategoryResponseDto } from './dto/category-response.dto';
import CreateCategoryDTO from './dto/create-category.dto';
import UpdateCategoryDTO from './dto/update-category.dto';

@Injectable()
export class CategoryMapper {
  mapCategoryToResponseDto(category: CategoryEntity): CategoryResponseDto {
    return plainToClass(CategoryResponseDto, category, { excludeExtraneousValues: true });
  }

  mapCategoriesToResponseDtos(categories: CategoryEntity[]): CategoryResponseDto[] {
    return categories.map(category => this.mapCategoryToResponseDto(category));
  }

  mapCreateCategoryDtoToEntity(createCategoryDto: CreateCategoryDTO): CategoryEntity {
    return plainToClass(CategoryEntity, createCategoryDto);
  }

  mapUpdateCategoryDtoToEntity(updateCategoryDto: UpdateCategoryDTO, existingCategory: CategoryEntity): CategoryEntity {
    const updatedCategory = plainToClass(CategoryEntity, updateCategoryDto);
    return { ...existingCategory, ...updatedCategory };
  }
}
