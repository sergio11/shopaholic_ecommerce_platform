import { AbstractEntity } from "src/core/abstract.entity";
import { Column, Entity } from "typeorm";
import { AutoMap } from '@automapper/classes';

@Entity({ name: 'categories' })
export class CategoryEntity extends AbstractEntity {

    @AutoMap()
    @Column({ unique: true })
    name: string;
    
    @AutoMap()
    @Column({ length: 1000 })
    description: string;
    
    @AutoMap()
    @Column({ length: 4000 })
    image: string;
}