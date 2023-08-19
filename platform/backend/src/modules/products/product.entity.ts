import { AfterLoad, Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { CategoryEntity } from '../categories/category.entity';
import { OrderHasProductsEntity } from '../orders/order_has_products.entity';
import { AbstractEntity } from 'src/core/abstract.entity';
import { ImageEntity } from '../images/image.entity';
import { BrandsEntity } from '../brands/brand.entity';
import { ProductReviewEntity } from './product-review.entity';

/**
 * Entity representing a product.
 */
@Entity({ name: 'products' })
export class ProductEntity extends AbstractEntity {

    /**
     * Name of the product.
     */
    @Column({ unique: true, type: 'varchar', length: 255})
    name: string;
    
    /**
     * Description of the product.
     */
    @Column({ name: "description", length: 1000, nullable: true})
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
    @OneToOne(() => ImageEntity)
    @JoinColumn({ name: 'id_main_image' })
    mainImage: ImageEntity;

    /**
     * Secondary image of the product.
     */
    @OneToOne(() => ImageEntity)
    @JoinColumn({ name: 'id_secondary_image' })
    secondaryImage: ImageEntity;
    
    /**
     * ID of the category to which the product belongs.
     */
    @Column({ name: "id_category"})
    readonly idCategory: string;

    /**
     * ID of the brand associated with the product.
     */
    @Column({ name: "id_brand"})
    readonly idBrand: string;
    
    /**
     * Price of the product.
     */
    @Column({ name: "price", type: 'decimal', precision: 10, scale: 2 })
    price: number;

    /**
     * ID of the brand associated with the product.
     */
    @ManyToOne(() => BrandsEntity, (brand) => brand.products)
    @JoinColumn({name: 'id_brand'})
    brand: BrandsEntity;

    /**
     * Category to which the product belongs.
     */
    @ManyToOne(() => CategoryEntity, (category) => category.id)
    @JoinColumn({name: 'id_category'})
    category: CategoryEntity

    /**
     * Derived attribute representing the number of reviews for this product.
     * @type {number}
     */
    numberOfReviews: number;

    /**
     * Derived attribute representing the number of times this product has been purchased.
     * @type {number}
     */
    numberOfPurchases: number;

    /**
     * Derived attribute for calculating the average rating
     * @type {number}
     */
    averageRating: number;

    /**
     * List of orders that include this product.
     */
    @OneToMany(() => OrderHasProductsEntity, (ohp) => ohp.product)
    @JoinColumn({ referencedColumnName: 'id_product' })
    orderHasProducts: OrderHasProductsEntity[]

    /**
     * List of reviews that include this product.
     */
    @OneToMany(() => ProductReviewEntity, review => review.product)
    reviews: ProductReviewEntity[];


    @AfterLoad()
    protected calculateNumberOfReviews() {
        this.numberOfReviews = this.reviews ? this.reviews.length : 0;
    }

    @AfterLoad()
    protected calculateNumberOfPurchases() {
        this.numberOfPurchases = this.orderHasProducts ? this.orderHasProducts.length : 0;
    }

    @AfterLoad()
    protected calculateAverageRating() {
        if (this.reviews && this.reviews.length > 0) {
            const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
            this.averageRating = totalRating / this.reviews.length;
        } else {
            this.averageRating = 0;
        }
    }
}