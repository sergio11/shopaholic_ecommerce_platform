import { AbstractEntity } from 'src/core/abstract.entity';
import { Entity, Column } from 'typeorm';

@Entity({ name: 'categories' })
export class ImageEntity extends AbstractEntity {
    
  @Column({ type: 'varchar', length: 4000 })
  url: string;

  @Column({ type: 'uuid', name: 'storage_id' })
  storageId: string;
}
