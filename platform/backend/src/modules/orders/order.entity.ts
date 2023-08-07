import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { UserEntity } from 'src/modules/users/user.entity';
import { AddressEntity } from '../address/address.entity';
import { OrderHasProductsEntity } from './order_has_products.entity';
import { AbstractEntity } from "src/core/abstract.entity";

@Entity({ name: 'orders' })
export class OrderEntity extends AbstractEntity {

    @Column({ name: "id_client" })
    idClient: string;
    
    @Column({ name: "id_address" })
    idAddress: string;

    @Column({default: 'PAGADO'})
    status: string;

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