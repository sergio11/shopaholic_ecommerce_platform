import { AbstractEntity } from "src/core/abstract.entity";
import { UserEntity } from "src/modules/users/user.entity";
import { Column, Entity, ManyToMany, PrimaryColumn } from "typeorm";
import { AutoMap } from '@automapper/classes';

@Entity({name: 'roles'})
export class RoleEntity extends AbstractEntity {
    
    @AutoMap()
    @Column({ unique: true })
    name: string
    
    @AutoMap()
    @Column()
    image: string

    @AutoMap()
    @Column()
    route: string

    @ManyToMany(() => UserEntity, (user) => user.roles)
    users: UserEntity[];

}