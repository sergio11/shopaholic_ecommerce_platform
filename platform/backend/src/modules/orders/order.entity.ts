import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from 'src/modules/users/user.entity';
import { AddressEntity } from '../address/address.entity';
import { OrderHasProductsEntity } from './order_has_products.entity';

@Entity({ name: 'orders' })
export class OrderEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "id_client" })
    idClient: number;
    
    @Column({ name: "id_address" })
    idAddress: number;

    @Column({default: 'PAGADO'})
    status: string;

    @Column({ name: "created_at", type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
    
    @Column({ name: "updated_at", type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @ManyToOne(() => UserEntity, (user) => user.id)
    @JoinColumn({ name: 'id_client' })
    user: UserEntity;
    
    @ManyToOne(() => AddressEntity, (address) => address.id)
    @JoinColumn({ name: 'id_address' })
    address: AddressEntity;

    @OneToMany(() => OrderHasProductsEntity, (ohp) => ohp.order)
    @JoinColumn({ referencedColumnName: 'id_order' })
    orderHasProducts: OrderHasProductsEntity[]


}