import { AbstractEntity } from 'src/core/abstract.entity';
import { OrderEntity } from 'src/modules/orders/order.entity';
import { UserEntity } from 'src/modules/users/user.entity';
import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { AutoMap } from '@automapper/classes';

@Entity({name: 'address'})
export class AddressEntity extends AbstractEntity {

    @AutoMap()
    @Column()
    address: string;
    
    @AutoMap()
    @Column()
    neighborhood: string;

    @Column({ name: "id_user" })
    idUser: string;

    @AutoMap()
    @OneToMany(() => OrderEntity, order => order.id)
    order: OrderEntity;

    @AutoMap()
    @ManyToOne(() => UserEntity, (user) => user.id)
    @JoinColumn({name: 'id_user'})
    user: UserEntity;

}