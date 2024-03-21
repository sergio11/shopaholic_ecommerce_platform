import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { OrderEntity } from 'src/modules/orders/order.entity';
import { ProductEntity } from 'src/modules/products/product.entity';
import { AbstractEntity } from 'src/core/abstract.entity';

/**
 * Entity representing the relationship between orders and products.
 */
@Entity({ name: 'order_has_products' })
export class OrderHasProductsEntity extends AbstractEntity {

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
  @ManyToOne(() => OrderEntity, (order) => order.id, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: 'id_order' })
  order: OrderEntity;

  /**
   * ProductEntity instance associated with the relationship.
   * @type {ProductEntity}
   */
  @ManyToOne(() => ProductEntity, (product) => product.id, {
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: 'id_product' })
  product: ProductEntity;
}
