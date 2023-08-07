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
      type: 'datetime',
      default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt: Date;
  
    @AutoMap()
    @UpdateDateColumn({
      name: 'updated_at',
      type: 'datetime',
      default: () => 'CURRENT_TIMESTAMP',
      onUpdate: 'CURRENT_TIMESTAMP',
    })
    updatedAt: Date;
  
    @AutoMap()
    @DeleteDateColumn({
      name: 'deleted_at',
      type: 'datetime',
    })
    @Exclude({ toPlainOnly: true })
    deletedAt?: Date;
  }