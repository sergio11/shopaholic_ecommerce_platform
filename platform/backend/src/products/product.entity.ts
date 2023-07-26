import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Category } from '../categories/category.entity';
import { OrderHasProducts } from '../orders/order_has_products.entity';

@Entity({ name: 'products' })
export class Product {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "name"})
    name: string;
    
    @Column({ name: "description"})
    description: string;

    @Column({ nullable: true })
    image1: string;
    
    @Column({ nullable: true })
    image2: string;
    
    @Column({ name: "id_category"})
    idCategory: number;
    
    @Column({ name: "price" })
    price: number;

    @Column({ name: "created_at", type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
    
    @Column({ name: "updated_at", type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @ManyToOne(() => Category, (category) => category.id)
    @JoinColumn({name: 'id_category'})
    category: Category

    @OneToMany(() => OrderHasProducts, (ohp) => ohp.product)
    @JoinColumn({ referencedColumnName: 'id_product' })
    orderHasProducts: OrderHasProducts[]


}