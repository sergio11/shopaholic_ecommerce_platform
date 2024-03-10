import {
  AfterLoad,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { CategoryEntity } from '../categories/category.entity';
import { OrderHasProductsEntity } from '../orders/order_has_products.entity';
import { AbstractEntity } from 'src/core/abstract.entity';
import { ImageEntity } from '../images/image.entity';
import { BrandsEntity } from '../brands/brand.entity';
import { ProductReviewEntity } from './product-review.entity';
import { UserEntity } from '../users/user.entity';

/**
 * Entity representing a product.
 */
@Entity({ name: 'products' })
export class ProductEntity extends AbstractEntity {
  /**
   * Name of the product.
   */
  @Column({ unique: true, type: 'varchar', length: 255 })
  name: string;

  /**
   * Description of the product.
   */
  @Column({ name: 'description', length: 1000, nullable: true })
  description: string;

  /**
   * The available stock of the product.
   * @example 50
   */
  @Column({ type: 'int', default: 0, nullable: false })
  stock: number;

  /**
   * Keywords associated with the product.
   */
  @Column({ type: 'varchar', length: 255, nullable: true })
  keywords: string;

  /**
   * The unique product code of the product.
   * @example PROD12345
   */
  @Column({ unique: true, nullable: false })
  productCode: string;

  /**
   * Main image of the product.
   */
  @OneToOne(() => ImageEntity, { cascade: true })
  @JoinColumn({ name: 'id_main_image' })
  mainImage: ImageEntity;

  /**
   * Secondary image of the product.
   */
  @OneToOne(() => ImageEntity, { cascade: true })
  @JoinColumn({ name: 'id_secondary_image' })
  secondaryImage: ImageEntity;

  /**
   * ID of the category to which the product belongs.
   */
  @Column({ name: 'id_category' })
  readonly idCategory: string;

  /**
   * ID of the brand associated with the product.
   */
  @Column({ name: 'id_brand' })
  readonly idBrand: string;

  /**
   * Price of the product.
   */
  @Column({ name: 'price', type: 'decimal', precision: 10, scale: 2 })
  price: number;

  /**
   * ID of the brand associated with the product.
   */
  @ManyToOne(() => BrandsEntity, (brand) => brand.products)
  @JoinColumn({ name: 'id_brand' })
  brand: BrandsEntity;

  /**
   * Category to which the product belongs.
   */
  @ManyToOne(() => CategoryEntity, (category) => category.id)
  @JoinColumn({ name: 'id_category' })
  category: CategoryEntity;

  /**
   * Derived attribute representing the number of reviews for this product.
   * @type {number}
   */
  @Column({ name: 'reviews_count', default: 0 })
  reviewsCount: number;

  /**
   * Derived attribute representing the number of times this product has been purchased.
   * @type {number}
   */
  @Column({ name: 'purchases_count', default: 0 })
  purchasesCount: number;

  /**
   * Derived attribute for calculating the average rating
   * @type {number}
   */
  @Column({ name: 'average_rating', default: 0 })
  averageRating: number;

  /**
   * List of orders that include this product.
   */
  @OneToMany(() => OrderHasProductsEntity, (ohp) => ohp.product)
  @JoinColumn({ referencedColumnName: 'id_product' })
  orderHasProducts: OrderHasProductsEntity[];

  /**
   * List of reviews that include this product.
   */
  @OneToMany(() => ProductReviewEntity, (review) => review.product)
  reviews: ProductReviewEntity[];

  /**
   * The users who liked the product.
   */
  @ManyToMany(() => UserEntity)
  @JoinTable({
    name: 'product_dislikes',
    joinColumn: {
      name: 'product_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
  })
  likes: UserEntity[];

  /**
   * The users who disliked the product.
   */
  @ManyToMany(() => UserEntity)
  @JoinTable({
    name: 'product_dislikes',
    joinColumn: {
      name: 'product_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
  })
  dislikes: UserEntity[];

  /**
   * The number of likes received by the product.
   */
  @Column({ name: 'likes_count', default: 0 })
  likesCount: number;

  /**
   * The number of dislikes received by the product.
   */
  @Column({ name: 'dislikes_count', default: 0 })
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
}
