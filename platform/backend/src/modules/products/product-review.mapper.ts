import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { ProductReviewEntity } from './product-review.entity';
import { ProductReviewResponseDto } from './dto/product-review-response.dto';
import { CreateProductReviewDto } from './dto/create-product-review.dto';
import { UpdateProductReviewDto } from './dto/update-product-review.dto';

/**
 * Service responsible for mapping between ProductReviewEntity and its DTOs.
 */
@Injectable()
export class ProductReviewMapper {
  /**
   * Maps a ProductReviewEntity instance to a ProductReviewResponseDto instance.
   * @param review - The ProductReviewEntity instance to map.
   * @returns The mapped ProductReviewResponseDto instance.
   */
  mapProductReviewToResponseDto(
    review: ProductReviewEntity,
  ): ProductReviewResponseDto {
    return plainToClass(ProductReviewResponseDto, review, {
      excludeExtraneousValues: true,
      exposeUnsetFields: false,
    });
  }

  /**
   * Maps an array of ProductReviewEntity instances to an array of ProductReviewResponseDto instances.
   * @param reviews - The array of ProductReviewEntity instances to map.
   * @returns The array of mapped ProductReviewResponseDto instances.
   */
  mapProductReviewsToResponseDtos(
    reviews: ProductReviewEntity[],
  ): ProductReviewResponseDto[] {
    return reviews.map((review) => this.mapProductReviewToResponseDto(review));
  }

  /**
   * Maps a CreateProductReviewDto instance to a ProductReviewEntity instance.
   * @param dto - The CreateProductReviewDto instance to map.
   * @returns The mapped ProductReviewEntity instance.
   */
  mapCreateDtoToEntity(dto: CreateProductReviewDto): ProductReviewEntity {
    return plainToClass(ProductReviewEntity, dto);
  }

  /**
   * Maps an UpdateProductReviewDto instance to an existing ProductReviewEntity instance.
   * @param dto - The UpdateProductReviewDto instance to map.
   * @param entity - The existing ProductReviewEntity instance to update.
   * @returns The updated ProductReviewEntity instance.
   */
  mapUpdateDtoToEntity(
    dto: UpdateProductReviewDto,
    entity: ProductReviewEntity,
  ): ProductReviewEntity {
    return Object.assign(entity, plainToClass(ProductReviewEntity, dto));
  }
}

