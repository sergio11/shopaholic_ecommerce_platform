import { AbstractEntity } from 'src/core/abstract.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { ProductEntity } from '../products/product.entity';

/**
 * Entity representing a brand.
 */
@Entity('brands')
export class BrandsEntity extends AbstractEntity {
    /**
     * The name of the brand.
     * @example Nike
     */
    @Column({ nullable: false, unique: true })
    name: string;

    /**
     * The slug for the brand.
     * @example nike
     */
    @Column({ nullable: false, unique: true })
    slug: string;

    /**
     * The image URL for the brand.
     * @example http://example.com/brand-image.jpg
     */
    @Column({ nullable: true })
    image: string;

    /**
     * Products associated with this brand.
     */
    @OneToMany(() => ProductEntity, (product) => product.brand)
    products: ProductEntity[];
}
