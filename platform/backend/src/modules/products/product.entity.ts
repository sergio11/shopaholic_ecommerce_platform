import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { CategoryEntity } from '../categories/category.entity';
import { OrderHasProductsEntity } from '../orders/order_has_products.entity';
import { AbstractEntity } from 'src/core/abstract.entity';
import { ImageEntity } from '../images/image.entity';

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
     * Main image of the product.
     */
    @OneToOne(() => ImageEntity)
    @JoinColumn({ name: 'main_image_id' })
    mainImage: ImageEntity;

    /**
     * Secondary image of the product.
     */
    @OneToOne(() => ImageEntity)
    @JoinColumn({ name: 'secondary_image_id' })
    secondaryImage: ImageEntity;
    
    /**
     * ID of the category to which the product belongs.
     */
    @Column({ name: "id_category"})
    readonly idCategory: string;
    
    /**
     * Price of the product.
     */
    @Column({ name: "price", type: 'decimal', precision: 10, scale: 2 })
    price: number;

    /**
     * Category to which the product belongs.
     */
    @ManyToOne(() => CategoryEntity, (category) => category.id)
    @JoinColumn({name: 'id_category'})
    category: CategoryEntity

    /**
     * List of orders that include this product.
     */
    @OneToMany(() => OrderHasProductsEntity, (ohp) => ohp.product)
    @JoinColumn({ referencedColumnName: 'id_product' })
    orderHasProducts: OrderHasProductsEntity[]
}