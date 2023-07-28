import { OrderEntity } from 'src/modules/orders/order.entity';
import { UserEntity } from 'src/modules/users/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

@Entity({name: 'address'})
export class AddressEntity {

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

    @OneToMany(() => OrderEntity, order => order.id)
    order: OrderEntity;

    @ManyToOne(() => UserEntity, (user) => user.id)
    @JoinColumn({name: 'id_user'})
    user: UserEntity;

}