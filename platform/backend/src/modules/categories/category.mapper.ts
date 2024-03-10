import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { CategoryEntity } from './category.entity';
import { CategoryResponseDto } from './dto/category-response.dto';
import CreateCategoryDTO from './dto/create-category.dto';
import UpdateCategoryDTO from './dto/update-category.dto';
import { ImageMapper } from '../images/image.mapper';

@Injectable()
export class CategoryMapper {

  constructor(private readonly imageMapper: ImageMapper) {}

  mapCategoryToResponseDto(category: CategoryEntity): CategoryResponseDto {
    const categoryResponseDto = plainToClass(CategoryResponseDto, category, {
      excludeExtraneousValues: true,
    });
    if (category.image) {
      const imageDto = this.imageMapper.mapImageToResponseDto(category.image);
      categoryResponseDto.image = imageDto;
    }
    return categoryResponseDto;
  }

  mapCategoriesToResponseDtos(
    categories: CategoryEntity[],
  ): CategoryResponseDto[] {
    return categories.map((category) =>
      this.mapCategoryToResponseDto(category),
    );
  }

  mapCreateCategoryDtoToEntity(
    createCategoryDto: CreateCategoryDTO,
  ): CategoryEntity {
    return plainToClass(CategoryEntity, createCategoryDto);
  }

  mapUpdateCategoryDtoToEntity(
    updateCategoryDto: UpdateCategoryDTO,
    existingCategory: CategoryEntity,
  ): CategoryEntity {
    const updatedCategory = plainToClass(CategoryEntity, updateCategoryDto);
    return { ...existingCategory, ...updatedCategory };
  }
}
