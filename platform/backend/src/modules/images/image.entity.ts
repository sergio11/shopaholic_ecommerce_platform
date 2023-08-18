import { AbstractEntity } from 'src/core/abstract.entity';
import { Entity, Column } from 'typeorm';

/**
 * Entity representing an image stored in the database.
 */
@Entity({ name: 'images' })
export class ImageEntity extends AbstractEntity {
  /**
   * URL of the image.
   * @example https://example.com/images/image.jpg
   */
  @Column({ type: 'varchar', length: 4000 })
  url: string;

  /**
   * ID of the associated storage for the image.
   * @example d6ad8265-8e52-4b7b-83a9-4b4deea84f22
   */
  @Column({ type: 'uuid', name: 'storage_id', unique: true })
  storageId: string;
}
