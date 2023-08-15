import { AbstractEntity } from 'src/core/abstract.entity';
import { OrderEntity } from 'src/modules/orders/order.entity';
import { UserEntity } from 'src/modules/users/user.entity';
import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

@Entity({name: 'address'})
export class AddressEntity extends AbstractEntity {

    @Column()
    address: string;
    
    @Column()
    neighborhood: string;

    @Column({ name: "id_user" })
    idUser: string;

    @OneToMany(() => OrderEntity, order => order.id)
    order: OrderEntity;

    @ManyToOne(() => UserEntity, (user) => user.id)
    @JoinColumn({name: 'id_user'})
    user: UserEntity;
}