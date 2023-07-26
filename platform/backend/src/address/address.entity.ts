import { User } from 'src/users/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Order } from 'src/orders/order.entity';

@Entity({name: 'address'})
export class Address {

    @PrimaryGeneratedColumn()
    id: number; 

    @Column()
    address: string;
    
    @Column()
    neighborhood: string;

    @Column()
    id_user: number;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
    
    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    @OneToMany(() => Order, order => order.id)
    order: Order;

    @ManyToOne(() => User, (user) => user.id)
    @JoinColumn({name: 'id_user'})
    user: User;

}