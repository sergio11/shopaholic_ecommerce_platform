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
import { UserEntity } from '../users/user.entity';
import { ProductEntity } from './product.entity';

/**
 * Service handling CRUD operations for product reviews.
 */
@Injectable()
export class ProductReviewService extends SupportService {
  constructor(
    @InjectRepository(ProductReviewEntity)
    private readonly productReviewRepository: Repository<ProductReviewEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private readonly productReviewMapper: ProductReviewMapper,
    i18n: I18nService,
  ) {
    super(i18n);
  }

  /**
   * Creates a new product review.
   * @param {CreateProductReviewDto} createDto - Product review data.
   * @returns {Promise<ProductReviewResponseDto>} - Created product review response DTO.
   */
  async create(
    createDto: CreateProductReviewDto,
  ): Promise<ProductReviewResponseDto> {
    const userFound = await this.findUser(createDto.idUser);
    const productFound = await this.findProduct(createDto.idProduct);
    const newReview = this.productReviewMapper.mapCreateDtoToEntity(createDto);
    newReview.product = productFound
    newReview.user = userFound
    const savedReview = await this.productReviewRepository.save(newReview);
    this.updateProductStats(savedReview.product); // Update product stats asynchronously
    return this.productReviewMapper.mapProductReviewToResponseDto(savedReview);
  }

  /**
   * Updates an existing product review.
   * @param {string} id - Product review ID.
   * @param {UpdateProductReviewDto} updateDto - Updated product review data.
   * @returns {Promise<ProductReviewResponseDto>} - Updated product review response DTO.
   */
  async update(
    id: string,
    updateDto: UpdateProductReviewDto,
  ): Promise<ProductReviewResponseDto> {
    const existingReview = await this.findProductReview(id);
    const updatedReview = this.productReviewMapper.mapUpdateDtoToEntity(
      updateDto,
      existingReview,
    );
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
    this.updateProductStats(reviewToDelete.product); // Update product stats asynchronously
    await this.productReviewRepository.remove(reviewToDelete);
    return this.resolveString('PRODUCT_REVIEW_DELETED_SUCCESSFULLY');
  }

  /**
   * Retrieves reviews of a product, sorted by creation date and excluding hidden reviews.
   * @param {string} idProduct - The ID of the product to retrieve reviews for.
   * @returns {Promise<ProductReviewResponseDto[]>} - An array of ProductReviewResponseDto representing the reviews.
   */
  async getProductReviews(
    idProduct: string,
  ): Promise<ProductReviewResponseDto[]> {
    const productReviews = await this.productReviewRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.product', 'product')
      .leftJoinAndSelect('review.user', 'user')
      .where('review.product = :productId', { productId: idProduct })
      .andWhere('review.isHidden = :isHidden', { isHidden: false })
      .orderBy('review.createdAt', 'DESC')
      .getMany();
    return this.productReviewMapper.mapProductReviewsToResponseDtos(
      productReviews,
    );
  }

  /**
   * Toggles the "like" reaction on a product review for a user.
   * @param {string} reviewId - The ID of the product review.
   * @param {string} idUser - The ID of the user reacting.
   * @returns {Promise<string>}  Successfully message
   */
  async likeReview(reviewId: string, idUser: string): Promise<string> {
    await this.toggleReaction(reviewId, idUser, 'likes');
    return this.resolveString('LIKE_REVIEW_SUCCESSFULLY');
  }

  /**
   * Toggles the "dislike" reaction on a product review for a user.
   * @param {string} reviewId - The ID of the product review.
   * @param {string} idUser - The ID of the user reacting.
   * @returns {Promise<string>} Successfully message
   */
  async dislikeReview(reviewId: string, idUser: string): Promise<string> {
    this.toggleReaction(reviewId, idUser, 'dislikes');
    return this.resolveString('DISLIKE_REVIEW_SUCCESSFULLY');
  }

  /**
   * Toggles a reaction (like or dislike) on a product review for a user.
   * @param {string} reviewId - The ID of the product review.
   * @param {string} idUser - The ID of the user reacting.
   * @param {'likes' | 'dislikes'} reactionField - The reaction field to toggle.
   * @returns {Promise<ProductReviewEntity>} The updated product review entity.
   * @throws {NotFoundException} If the product review is not found or if the user is not found.
   */
  private async toggleReaction(
    reviewId: string,
    idUser: string,
    reactionField: 'likes' | 'dislikes',
  ): Promise<ProductReviewEntity> {
    const otherReactionField = reactionField === 'likes' ? 'dislikes' : 'likes';
    const userFound = await this.findUser(idUser);
    const allReviews = await this.productReviewRepository.find({ relations:[reactionField, otherReactionField]});
    const updatedReviews: ProductReviewEntity[] = [];

    for (const r of allReviews) {
      if (r.id === reviewId) {
        if (
          r[reactionField].some((reactionUser) => reactionUser.id === idUser)
        ) {
          // User has already reacted, remove the reaction
          r[reactionField] = r[reactionField].filter(
            (reactionUser) => reactionUser.id !== idUser,
          );
        } else {
          // User has not reacted, add the reaction
          r[reactionField].push(userFound);
          // Remove other reaction if the user has reacted before
          r[otherReactionField] = r[otherReactionField].filter(
            (otherReactionUser) => otherReactionUser.id !== idUser,
          );
        }
      }

      const likesCount = r.likes.length;
      const dislikesCount = r.dislikes.length;
      r.likesCount = likesCount;
      r.dislikesCount = dislikesCount;
      r.isBestRated = likesCount >= dislikesCount;
      r.isWorstRated = dislikesCount > likesCount;

      updatedReviews.push(r);
    }
    
    await this.productReviewRepository.save(updatedReviews);
    return this.findProductReview(reviewId, [reactionField, otherReactionField]);
  }

  /**
   * Updates the statistics of a product including the number of reviews and the average rating.
   * @param product The product entity whose statistics need to be updated.
   * @returns A Promise that resolves when the update operation is complete.
   */
  private async updateProductStats(product: ProductEntity): Promise<void> {
    const reviews = await this.productReviewRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.product', 'product')
      .leftJoinAndSelect('review.user', 'user')
      .where('review.product = :productId', { productId: product.id })
      .andWhere('review.isHidden = :isHidden', { isHidden: false })
      .getMany();

    const reviewsCount = reviews.length;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviewsCount;

    product.reviewsCount = reviewsCount;
    product.averageRating = averageRating;

    // Perform the save operation asynchronously
    await this.productRepository.save(product);
    console.log(`Product statistics updated for product ${product.id}`);
  }

  /**
   * Finds a product review by its ID with optional relations.
   * @param {string} id - The ID of the product review.
   * @param {string[]} relations - Optional relations to load with the query.
   * @returns {Promise<ProductReviewEntity>} The found product review entity.
   * @throws {NotFoundException} If the product review is not found.
   */
  private async findProductReview(
    id: string,
    relations?: string[],
  ): Promise<ProductReviewEntity> {
    const review = await this.productReviewRepository.findOne({
      where: { id },
      relations: relations || [],
    });
    if (!review) {
      this.throwNotFoundException('PRODUCT_REVIEW_NOT_FOUND');
    }
    return review;
  }

  /**
   * Finds a user by their ID.
   * @param id ID of the user to be found.
   * @returns The found user entity.
   * @throws NotFoundException if user is not found.
   */
  private async findUser(id: string): Promise<UserEntity> {
    return this.findEntityById(id, this.userRepository, 'USER_NOT_FOUND', [
      'roles',
    ]);
  }

  /**
   * Finds a product by its ID and retrieves optional relations.
   * @param id The ID of the product to find.
   * @param relations Optional array of relation names to be retrieved along with the product.
   * @returns A Promise that resolves with the found ProductEntity or throws an error if not found.
   */
  private async findProduct(
    id: string,
    relations?: string[],
  ): Promise<ProductEntity> {
    return await this.findEntityById(
      id,
      this.productRepository,
      'PRODUCT_NOT_FOUND',
      relations,
    );
  }
}
