import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { OrderEntity } from 'src/modules/orders/order.entity';
import { ProductEntity } from 'src/modules/products/product.entity';

@Entity({ name: 'order_has_products' })
export class OrderHasProductsEntity {

    @PrimaryColumn({ name: "id_order" })
    idOrder: number;
    
    @PrimaryColumn({ name: "id_product" })
    idProduct: number;

    @Column()
    quantity: number;

    @Column({ name: "created_at", type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
    
    @Column({ name: "updated_at", type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @ManyToOne(() => OrderEntity, (order) => order.id)
    @JoinColumn({ name: 'id_order' })
    order: OrderEntity
    
    @ManyToOne(() => ProductEntity, (product) => product.id)
    @JoinColumn({ name: 'id_product' })
    product: ProductEntity

}