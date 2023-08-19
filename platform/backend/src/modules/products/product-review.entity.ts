import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
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
     * ID of the product to which the review belongs.
     */
    @Column({ name: "id_product"})
    readonly idProduct: string;

    /**
     * ID of the user associated with the product review.
     */
    @Column({ name: "is_user"})
    readonly idUser: string;

    /**
     * Product associated with this review.
     */
    @ManyToOne(() => ProductEntity, product => product.reviews, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'product_id' })
    product: ProductEntity;

    /**
     * User who wrote the review.
     */
    @ManyToOne(() => UserEntity, user => user.productReviews)
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;
}
