import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { CategoryEntity } from './category.entity';
import { CategoryResponseDto } from './dto/category-response.dto';

@Injectable()
export class CategoryMapper {
  mapCategoryToResponseDto(category: CategoryEntity): CategoryResponseDto {
    return plainToClass(CategoryResponseDto, category, { excludeExtraneousValues: true });
  }

  mapCategoriesToResponseDtos(categories: CategoryEntity[]): CategoryResponseDto[] {
    return categories.map(category => this.mapCategoryToResponseDto(category));
  }
}
