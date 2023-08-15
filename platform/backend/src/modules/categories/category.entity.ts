import { AbstractEntity } from "src/core/abstract.entity";
import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { ImageEntity } from "../images/image.entity";

/**
 * Represents a category of products.
 */
@Entity({ name: 'categories' })
export class CategoryEntity extends AbstractEntity {

    /**
     * The name of the category.
     */
    @Column({ unique: true, type: 'varchar', length: 255 })
    name: string;
    
    /**
     * The description of the category.
     */
    @Column({ length: 1000, nullable: true })
    description: string;
    
    /**
     * The associated image for the category.
     */
    @OneToOne(() => ImageEntity)
    @JoinColumn({ name: 'image_id' })
    image: ImageEntity;
}
