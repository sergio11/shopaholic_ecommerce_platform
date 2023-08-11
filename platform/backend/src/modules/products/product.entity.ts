import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { CategoryEntity } from '../categories/category.entity';
import { OrderHasProductsEntity } from '../orders/order_has_products.entity';
import { AbstractEntity } from 'src/core/abstract.entity';
import { AutoMap } from '@automapper/classes';

@Entity({ name: 'products' })
export class ProductEntity extends AbstractEntity {

    @AutoMap()
    @Column({ name: "name"})
    name: string;
    
    @AutoMap()
    @Column({ name: "description"})
    description: string;

    @AutoMap()
    @Column({ nullable: true, length: 4000 })
    image1: string;
    
    @AutoMap()
    @Column({ nullable: true, length: 4000 })
    image2: string;
    
    @Column({ name: "id_category"})
    idCategory: string;
    
    @AutoMap()
    @Column({ name: "price" })
    price: number;

    @AutoMap()
    @ManyToOne(() => CategoryEntity, (category) => category.id)
    @JoinColumn({name: 'id_category'})
    category: CategoryEntity

    @OneToMany(() => OrderHasProductsEntity, (ohp) => ohp.product)
    @JoinColumn({ referencedColumnName: 'id_product' })
    orderHasProducts: OrderHasProductsEntity[]

}