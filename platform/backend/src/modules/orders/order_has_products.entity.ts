import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { OrderEntity } from 'src/modules/orders/order.entity';
import { ProductEntity } from 'src/modules/products/product.entity';
import { AbstractEntity } from 'src/core/abstract.entity';

/**
 * Entity representing the relationship between orders and products.
 */
@Entity({ name: 'order_has_products' })
export class OrderHasProductsEntity extends AbstractEntity {
  /**
   * ID of the order associated with the relationship.
   * @type {string}
   */
  @PrimaryColumn({ name: 'id_order' })
  readonly idOrder: string;

  /**
   * ID of the product associated with the relationship.
   * @type {string}
   */
  @PrimaryColumn({ name: 'id_product' })
  readonly idProduct: string;

  /**
   * Quantity of the product in the order.
   * @type {number}
   */
  @Column({ type: 'int', unsigned: true, default: 1 })
  quantity: number;

  /**
   * OrderEntity instance associated with the relationship.
   * @type {OrderEntity}
   */
  @ManyToOne(() => OrderEntity, (order) => order.id)
  @JoinColumn({ name: 'id_order' })
  order: OrderEntity;

  /**
   * ProductEntity instance associated with the relationship.
   * @type {ProductEntity}
   */
  @ManyToOne(() => ProductEntity, (product) => product.id)
  @JoinColumn({ name: 'id_product' })
  product: ProductEntity;
}
