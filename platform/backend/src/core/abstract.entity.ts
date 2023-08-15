import {
    CreateDateColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    DeleteDateColumn,
  } from 'typeorm';
  import { Exclude } from 'class-transformer';

/**
 * Interface for the abstract entity properties.
 * @interface
 */
export interface IAbstractEntity {
  /**
   * Unique identifier of the entity.
   */
  id: string;

  /**
   * Timestamp of when the entity was created.
   */
  createdAt: Date;

  /**
   * Timestamp of when the entity was last updated.
   */
  updatedAt: Date;

  /**
   * Timestamp of when the entity was soft-deleted (if applicable).
   */
  deletedAt?: Date;
}

/**
 * Abstract class representing a base entity with common fields.
 * @abstract
 * @class
 */
export abstract class AbstractEntity implements IAbstractEntity {
  /**
   * Unique identifier of the entity.
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Timestamp of when the entity was created.
   * @type {Date}
   */
  @CreateDateColumn({
    name: 'created_at',
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  /**
   * Timestamp of when the entity was last updated.
   * @type {Date}
   */
  @UpdateDateColumn({
    name: 'updated_at',
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  /**
   * Timestamp of when the entity was soft-deleted (if applicable).
   * @type {Date}
   */
  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'datetime',
  })
  @Exclude({ toPlainOnly: true })
  deletedAt?: Date;
}