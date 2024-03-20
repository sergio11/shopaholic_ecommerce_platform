import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { CategoryEntity } from './category.entity';
import { CategoryResponseDto } from './dto/category-response.dto';
import CreateCategoryDTO from './dto/create-category.dto';
import UpdateCategoryDTO from './dto/update-category.dto';
import { StorageMixin } from '../storage/mixin/file-saving.mixin';
import { ImageResponseDto } from '../images/dto/image-response.dto';

@Injectable()
export class CategoryMapper {

  constructor(private readonly storageMixin: StorageMixin) {}

  async mapCategoryToResponseDto(category: CategoryEntity): Promise<CategoryResponseDto> {
    const categoryResponseDto = plainToClass(CategoryResponseDto, category, {
      excludeExtraneousValues: true,
    });
    if (category.image) {
      const url = await this.storageMixin.getImageUrl(category.image.storageId);
      if (url) {
        const imageResponseDto = new ImageResponseDto();
        imageResponseDto.url = url;
        categoryResponseDto.image = imageResponseDto;
      }
    }
    return categoryResponseDto;
  }

  async mapCategoriesToResponseDtos(
    categories: CategoryEntity[],
  ): Promise<CategoryResponseDto[]> {
    const responseDtos: CategoryResponseDto[] = [];
    for (const category of categories) {
      const categoryResponseDto = await this.mapCategoryToResponseDto(category);
      responseDtos.push(categoryResponseDto);
    }
    return responseDtos;
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
