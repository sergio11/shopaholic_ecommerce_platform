import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductReviewEntity } from './product-review.entity';
import { SupportService } from 'src/core/support.service';
import { I18nService } from 'nestjs-i18n';
import { ProductReviewMapper } from './product-review.mapper';
import { CreateProductReviewDto } from './dto/create-product-review.dto';
import { UpdateProductReviewDto } from './dto/update-product-review.dto';
import { ProductReviewResponseDto } from './dto/product-review-response.dto';

/**
 * Service handling CRUD operations for product reviews.
 */
@Injectable()
export class ProductReviewService extends SupportService {

    constructor(
        @InjectRepository(ProductReviewEntity)
        private readonly productReviewRepository: Repository<ProductReviewEntity>,
        private readonly productReviewMapper: ProductReviewMapper,
        i18n: I18nService
    ) {
        super(i18n);
    }

    /**
     * Creates a new product review.
     * @param {CreateProductReviewDto} createDto - Product review data.
     * @returns {Promise<ProductReviewResponseDto>} - Created product review response DTO.
     */
    async create(createDto: CreateProductReviewDto): Promise<ProductReviewResponseDto> {
        const newReview = this.productReviewMapper.mapCreateDtoToEntity(createDto);
        const savedReview = await this.productReviewRepository.save(newReview);
        return this.productReviewMapper.mapProductReviewToResponseDto(savedReview);
    }

    /**
     * Updates an existing product review.
     * @param {string} id - Product review ID.
     * @param {UpdateProductReviewDto} updateDto - Updated product review data.
     * @returns {Promise<ProductReviewResponseDto>} - Updated product review response DTO.
     */
    async update(id: string, updateDto: UpdateProductReviewDto): Promise<ProductReviewResponseDto> {
        const existingReview = await this.findProductReview(id);
        const updatedReview = this.productReviewMapper.mapUpdateDtoToEntity(updateDto, existingReview);
        const savedReview = await this.productReviewRepository.save(updatedReview);
        return this.productReviewMapper.mapProductReviewToResponseDto(savedReview);
    }

    /**
     * Deletes a product review by ID.
     * @param {string} id - Product review ID.
     * @returns {Promise<string>}
     */
    async delete(id: string): Promise<string> {
        const reviewToDelete = await this.findProductReview(id);
        await this.productReviewRepository.remove(reviewToDelete);
        return this.resolveString("PRODUCT_REVIEW_DELETED_SUCCESSFULLY");
    }

    private async findProductReview(id: string): Promise<ProductReviewEntity> {
        const review = await this.productReviewRepository.findOne({ where: {id} });
        if (!review) {
            this.throwNotFoundException('PRODUCT_REVIEW_NOT_FOUND');
        }
        return review;
    }
}

