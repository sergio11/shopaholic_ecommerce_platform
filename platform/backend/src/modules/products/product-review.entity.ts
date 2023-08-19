import {
  AfterLoad,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from 'typeorm';
import { ProductEntity } from '../products/product.entity';
import { UserEntity } from '../users/user.entity';
import { AbstractEntity } from 'src/core/abstract.entity';

/**
 * Entity representing a product review made by a customer.
 */
@Entity({ name: 'product_reviews' })
export class ProductReviewEntity extends AbstractEntity {
  /**
   * Textual review provided by the customer.
   */
  @Column({ name: 'review_text', type: 'text', nullable: false })
  reviewText: string;

  /**
   * Numeric rating given by the customer (0 to 5).
   */
  @Column({ type: 'float', nullable: false, precision: 2, scale: 1 })
  rating: number;

  /**
   * Product review is hidden
   */
  @Column({ name: 'is_hidden', type: 'boolean', default: false })
  readonly isHidden: boolean;

  /**
   * ID of the product to which the review belongs.
   */
  @Column({ name: 'id_product' })
  readonly idProduct: string;

  /**
   * ID of the user associated with the product review.
   */
  @Column({ name: 'is_user' })
  readonly idUser: string;

  /**
   * Product associated with this review.
   */
  @ManyToOne(() => ProductEntity, (product) => product.reviews, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity;

  /**
   * User who wrote the review.
   */
  @ManyToOne(() => UserEntity, (user) => user.productReviews)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  /**
   * The users who liked the review.
   */
  @ManyToMany(() => UserEntity)
  @JoinTable({
    name: 'review_likes',
    joinColumn: {
      name: 'review_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
  })
  likes: UserEntity[];

  /**
   * The users who disliked the review.
   */
  @ManyToMany(() => UserEntity)
  @JoinTable({
    name: 'review_dislikes',
    joinColumn: {
      name: 'review_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
  })
  dislikes: UserEntity[];

  /**
   * The number of likes received by the review.
   * This property is calculated after the entity is loaded.
   */
  likesCount: number;

  /**
   * The number of dislikes received by the review.
   * This property is calculated after the entity is loaded.
   */
  dislikesCount: number;

  /**
   * Indicates if the review has the best rating among all reviews for the product.
   */
  @Column({ name: 'is_best_rated', type: 'boolean', default: false })
  isBestRated: boolean;

  /**
   * Indicates if the review has the worst rating among all reviews for the product.
   */
  @Column({ name: 'is_worst_rated', type: 'boolean', default: false })
  isWorstRated: boolean;

  /**
   * Calculates the number of likes and dislikes after the entity is loaded.
   * This method is automatically invoked by the @AfterLoad decorator.
   */
  @AfterLoad()
  protected calculateLikesAndDislikesCounts() {
    this.likesCount = this.likes.length;
    this.dislikesCount = this.dislikes.length;
  }
}
