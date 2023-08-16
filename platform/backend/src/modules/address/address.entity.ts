import { AbstractEntity } from 'src/core/abstract.entity';
import { OrderEntity } from 'src/modules/orders/order.entity';
import { Entity, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from '../users/user.entity';

/**
 * Entity representing an address.
 */
@Entity({ name: 'address' })
export class AddressEntity extends AbstractEntity {
    /**
     * Street address.
     * @example 123 Main Street
     */
    @Column({ type: 'varchar', length: 255 })
    name: string;

    /**
     * Neighborhood of the address.
     * @example Downtown
     */
    @Column({ type: 'varchar', length: 100 })
    neighborhood: string;

    /**
     * Id User associated with this address.
    */
    @Column({ name: 'id_user' })
    readonly idUser: string;

    /**
     * User associated with this address.
     */
    @ManyToOne(() => UserEntity, user => user.addresses)
    @JoinColumn({ name: 'id_user' })
    user: UserEntity;

    /**
     * Orders associated with this address.
     */
    @OneToMany(() => OrderEntity, order => order.address)
    order: OrderEntity[];
}
