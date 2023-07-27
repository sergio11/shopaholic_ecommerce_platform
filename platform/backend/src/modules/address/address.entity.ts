import { Order } from 'src/modules/orders/order.entity';
import { User } from 'src/modules/users/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

@Entity({name: 'address'})
export class Address {

    @PrimaryGeneratedColumn()
    id: number; 

    @Column()
    address: string;
    
    @Column()
    neighborhood: string;

    @Column({ name: "id_user" })
    idUser: number;

    @Column({ name: "created_at", type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
    
    @Column({ name: "updated_at", type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @OneToMany(() => Order, order => order.id)
    order: Order;

    @ManyToOne(() => User, (user) => user.id)
    @JoinColumn({name: 'id_user'})
    user: User;

}