import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { OrderEntity } from 'src/modules/orders/order.entity';
import { ProductEntity } from 'src/modules/products/product.entity';
import { AbstractEntity } from 'src/core/abstract.entity';

@Entity({ name: 'order_has_products' })
export class OrderHasProductsEntity extends AbstractEntity {

    @PrimaryColumn({ name: "id_order" })
    idOrder: string;
    
    @PrimaryColumn({ name: "id_product" })
    idProduct: string;

    @Column()
    quantity: number;

    @ManyToOne(() => OrderEntity, (order) => order.id)
    @JoinColumn({ name: 'id_order' })
    order: OrderEntity
    
    @ManyToOne(() => ProductEntity, (product) => product.id)
    @JoinColumn({ name: 'id_product' })
    product: ProductEntity

}