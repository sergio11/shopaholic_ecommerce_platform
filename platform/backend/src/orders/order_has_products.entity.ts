import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Order } from 'src/orders/order.entity';
import { Product } from 'src/products/product.entity';

@Entity('order_has_products')
export class OrderHasProducts {

    @PrimaryColumn({ name: "id_order" })
    id_order: number;
    
    @PrimaryColumn({ name: "id_product" })
    idProduct: number;

    @Column()
    quantity: number;

    @Column({ name: "created_at", type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
    
    @Column({ name: "updated_at", type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @ManyToOne(() => Order, (order) => order.id)
    @JoinColumn({ name: 'id_order' })
    order: Order
    
    @ManyToOne(() => Product, (product) => product.id)
    @JoinColumn({ name: 'id_product' })
    product: Product

}