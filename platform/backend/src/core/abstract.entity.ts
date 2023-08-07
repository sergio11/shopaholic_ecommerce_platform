import {
    CreateDateColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    DeleteDateColumn,
  } from 'typeorm';
  import { Exclude } from 'class-transformer';
  import { AutoMap } from '@automapper/classes';
  
  export interface IAbstractEntity {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
  }
  
  export abstract class AbstractEntity implements IAbstractEntity {
    @AutoMap()
    @PrimaryGeneratedColumn('uuid')
    @Exclude({ toPlainOnly: true })
    id: string;
  
    @AutoMap()
    @CreateDateColumn({
      name: 'created_at',
      type: 'timestamptz',
      default: () => 'CURRENT_TIMESTAMP(6)',
    })
    createdAt: Date;
  
    @AutoMap()
    @UpdateDateColumn({
      name: 'updated_at',
      type: 'timestamptz',
      default: () => 'CURRENT_TIMESTAMP(6)',
      onUpdate: 'CURRENT_TIMESTAMP(6)',
    })
    updatedAt: Date;
  
    @AutoMap()
    @DeleteDateColumn({
      name: 'deleted_at',
      type: 'timestamp',
    })
    @Exclude({ toPlainOnly: true })
    deletedAt?: Date;
  }