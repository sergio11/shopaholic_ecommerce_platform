import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { ProductReviewEntity } from './product-review.entity';
import { ProductReviewResponseDto } from './dto/product-review-response.dto';
import { CreateProductReviewDto } from './dto/create-product-review.dto';
import { UpdateProductReviewDto } from './dto/update-product-review.dto';

@Injectable()
export class ProductReviewMapper {
    mapProductReviewToResponseDto(review: ProductReviewEntity): ProductReviewResponseDto {
        return plainToClass(ProductReviewResponseDto, review, { excludeExtraneousValues: true, exposeUnsetFields: false });
    }

    mapProductReviewsToResponseDtos(reviews: ProductReviewEntity[]): ProductReviewResponseDto[] {
        return reviews.map(review => this.mapProductReviewToResponseDto(review));
    }

    mapCreateDtoToEntity(dto: CreateProductReviewDto): ProductReviewEntity {
        return plainToClass(ProductReviewEntity, dto);
    }

    mapUpdateDtoToEntity(dto: UpdateProductReviewDto, entity: ProductReviewEntity): ProductReviewEntity {
        return Object.assign(entity, plainToClass(ProductReviewEntity, dto));
    }
}
