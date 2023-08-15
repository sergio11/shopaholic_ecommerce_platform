import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { UserEntity } from 'src/modules/users/user.entity';
import { AddressEntity } from '../address/address.entity';
import { OrderHasProductsEntity } from './order_has_products.entity';
import { AbstractEntity } from 'src/core/abstract.entity';
import { OrderStatus } from './order-status.enum';

/**
 * Entity representing an order.
 */
@Entity({ name: 'orders' })
export class OrderEntity extends AbstractEntity {
  /**
   * ID of the client placing the order.
   */
  @Column({ name: 'id_client' })
  idClient: string;

  /**
   * ID of the delivery address for the order.
   */
  @Column({ name: 'id_address' })
  idAddress: string;

  /**
   * Status of the order.
   */
  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  /**
   * User associated with the order.
   */
  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({ name: 'id_client' })
  user: UserEntity;

  /**
   * Delivery address associated with the order.
   */
  @ManyToOne(() => AddressEntity, (address) => address.id)
  @JoinColumn({ name: 'id_address' })
  address: AddressEntity;

  /**
   * List of products included in the order.
   */
  @OneToMany(() => OrderHasProductsEntity, (ohp) => ohp.order)
  @JoinColumn({ referencedColumnName: 'id_order' })
  orderHasProducts: OrderHasProductsEntity[];
}