import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from 'src/modules/users/user.entity';
import { Address } from '../address/address.entity';
import { OrderHasProducts } from './order_has_products.entity';

@Entity('orders')
export class Order {

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

    @ManyToOne(() => User, (user) => user.id)
    @JoinColumn({ name: 'id_client' })
    user: User;
    
    @ManyToOne(() => Address, (address) => address.id)
    @JoinColumn({ name: 'id_address' })
    address: Address;

    @OneToMany(() => OrderHasProducts, (ohp) => ohp.order)
    @JoinColumn({ referencedColumnName: 'id_order' })
    orderHasProducts: OrderHasProducts[]


}