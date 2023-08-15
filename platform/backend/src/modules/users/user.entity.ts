import { Entity, Column, BeforeInsert, ManyToMany, JoinTable, OneToOne, JoinColumn } from 'typeorm';
import { hash } from 'bcrypt';
import { RoleEntity } from 'src/modules/roles/role.entity';
import { AbstractEntity } from 'src/core/abstract.entity';
import { ImageEntity } from '../images/image.entity';

@Entity({ name: 'users' })
export class UserEntity extends AbstractEntity {

    /**
     * User's full name.
     */
    @Column({ length: 100 })
    name: string;

    /**
     * User's last name.
     */
    @Column({ length: 100 })
    lastname: string;

    /**
     * User's email (unique).
     */
    @Column({ unique: true })
    email: string;

    /**
     * User's phone number (unique).
     */
    @Column({ unique: true })
    phone: string;

    /**
     * User's profile image.
     */
    @OneToOne(() => ImageEntity)
    @JoinColumn({ name: 'image_id' })
    image: ImageEntity;

    /**
     * Hashed password of the user.
     */
    @Column()
    password: string;

    /**
     * Notification token associated with the user.
     */
    @Column({ name: 'notification_token', nullable: true })
    notificationToken: string;

    /**
     * User's country.
     */
    @Column({ length: 50 })
    country: string;

    /**
     * User's preferred language.
     */
    @Column({ length: 10 })
    language: string;

    /**
     * Roles associated with the user.
     */
    @JoinTable({
        name: 'user_has_roles',
        joinColumn: {
            name: 'id_user'
        },
        inverseJoinColumn: {
            name: 'id_rol'
        }
    })
    @ManyToMany(() => RoleEntity, (rol) => rol.users)
    roles: RoleEntity[];

    /**
     * Hashes the user's password before insertion.
     */
    @BeforeInsert()
    async hashPassword() {
        this.password = await hash(this.password, Number(process.env.HASH_SALT));
    }
}
