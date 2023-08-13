import { Entity, Column, BeforeInsert, ManyToMany, JoinTable } from 'typeorm';
import { hash } from 'bcrypt';
import { RoleEntity } from 'src/modules/roles/role.entity';
import { AbstractEntity } from 'src/core/abstract.entity';
import { AutoMap } from '@automapper/classes';

@Entity({ name: 'users'})
export class UserEntity extends AbstractEntity  {

    @AutoMap()
    @Column()
    name: string;
    
    @AutoMap()
    @Column()
    lastname: string;

    @AutoMap()
    @Column({ unique: true })
    email: string;
    
    @AutoMap()
    @Column({ unique: true })
    phone: string;
    
    @AutoMap()
    @Column({ length: 4000, nullable: true })
    image: string;
    
    @Column()
    password: string;
    
    @Column({ name: "notification_token", nullable: true })
    notificationToken: string;
    
    @AutoMap()
    @Column()
    country: string;

    @AutoMap()
    @Column()
    language: string;

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

    @BeforeInsert()
    async hashPassword() {
        this.password = await hash(this.password, Number(process.env.HASH_SALT));
    }

}