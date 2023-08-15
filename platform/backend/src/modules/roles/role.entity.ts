import { AbstractEntity } from 'src/core/abstract.entity';
import { UserEntity } from 'src/modules/users/user.entity';
import { Column, Entity, ManyToMany, OneToOne, JoinColumn } from 'typeorm';
import { ImageEntity } from 'src/modules/images/image.entity';

/**
 * Entity representing a user role.
 */
@Entity({ name: 'roles' })
export class RoleEntity extends AbstractEntity {

    /**
     * Name of the role.
     */
    @Column({ unique: true })
    name: string;

    /**
     * Image associated with the role.
     */
    @OneToOne(() => ImageEntity)
    @JoinColumn({ name: 'image_id' })
    image: ImageEntity;

    /**
     * Route associated with the role.
     */
    @Column()
    route: string;

    /**
     * Users assigned to this role.
     */
    @ManyToMany(() => UserEntity, (user) => user.roles)
    users: UserEntity[];
}
