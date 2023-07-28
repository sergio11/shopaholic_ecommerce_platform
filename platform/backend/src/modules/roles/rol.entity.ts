import { UserEntity } from "src/modules/users/user.entity";
import { Column, Entity, ManyToMany, PrimaryColumn } from "typeorm";

@Entity({name: 'roles'})
export class RoleEntity {
    
    @PrimaryColumn()
    id: string;

    @Column({ unique: true })
    name: string
    
    @Column()
    image: string

    @Column()
    route: string

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
    
    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    @ManyToMany(() => UserEntity, (user) => user.roles)
    users: UserEntity[];

}