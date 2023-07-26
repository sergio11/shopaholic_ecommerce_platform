import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, ManyToMany, JoinTable } from 'typeorm';
import { hash } from 'bcrypt';
import { Rol } from 'src/roles/rol.entity';

@Entity({ name: 'users' })
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
    
    @Column()
    lastname: string;

    @Column({ unique: true })
    email: string;
    
    @Column({ unique: true })
    phone: string;
    
    @Column({ nullable: true })
    image: string;
    
    @Column()
    password: string;
    
    @Column({ name: "notification_token", nullable: true })
    notificationToken: string;
    
    @Column({ name: "created_at", type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
    
    @Column({ name: "updated_at", type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @JoinTable({
        name: 'user_has_roles',
        joinColumn: {
            name: 'id_user'
        },
        inverseJoinColumn: {
            name: 'id_rol'
        }
    })
    @ManyToMany(() => Rol, (rol) => rol.users)
    roles: Rol[];

    @BeforeInsert()
    async hashPassword() {
        this.password = await hash(this.password, Number(process.env.HASH_SALT));
    }

}