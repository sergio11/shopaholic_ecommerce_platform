import { AbstractEntity } from "src/core/abstract.entity";
import { Column, Entity } from "typeorm";
import { AutoMap } from '@automapper/classes';

@Entity({ name: 'categories' })
export class CategoryEntity extends AbstractEntity {

    @AutoMap()
    @Column({ unique: true })
    name: string;
    
    @AutoMap()
    @Column()
    description: string;
    
    @AutoMap()
    @Column()
    image: string;
}