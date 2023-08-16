import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { ProductEntity } from './product.entity';
import { ProductResponseDto } from './dto/product-response.dto';
import { CategoryMapper } from '../categories/category.mapper';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductMapper {
  constructor(private readonly categoryMapper: CategoryMapper) {}

  mapProductToResponseDto(product: ProductEntity): ProductResponseDto {
    const productDto = plainToClass(ProductResponseDto, product, { excludeExtraneousValues: true });
    if (product.category) {
      productDto.category = this.categoryMapper.mapCategoryToResponseDto(product.category);
    }
    return productDto;
  }

  mapProductsToResponseDtos(products: ProductEntity[]): ProductResponseDto[] {
    return products.map(product => this.mapProductToResponseDto(product));
  }

  mapCreateProductDtoToEntity(dto: CreateProductDto): ProductEntity {
    return plainToClass(ProductEntity, dto);
  }

  mapUpdateProductDtoToEntity(dto: UpdateProductDto, entity: ProductEntity): ProductEntity {
    return Object.assign(entity, plainToClass(ProductEntity, dto));
  }
}
