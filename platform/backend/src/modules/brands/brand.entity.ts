import { AbstractEntity } from 'src/core/abstract.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { ProductEntity } from '../products/product.entity';
import { ImageEntity } from '../images/image.entity';

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
   * The associated image for the category.
   */
  @OneToOne(() => ImageEntity, { cascade: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'image_id' })
  image: ImageEntity;

  /**
   * Products associated with this brand.
   */
  @OneToMany(() => ProductEntity, (product) => product.brand)
  products: ProductEntity[];
}
