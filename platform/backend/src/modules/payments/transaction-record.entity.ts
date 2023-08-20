import { AbstractEntity } from 'src/core/abstract.entity';
import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  Check,
  Index
} from 'typeorm';
import { UserEntity } from '../users/user.entity';

/**
 * Enumerado para los posibles valores del campo "status" en TransactionRecordEntity.
 */
export enum TransactionStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILURE = 'failure',
}

/**
 * Represents a transaction record entity.
 */
@Entity()
@Index(['sessionId', 'customerId'], { unique: true })
@Check(`"amount" >= 0`)
export class TransactionRecordEntity extends AbstractEntity {
  /**
   * The unique session ID associated with the transaction.
   */
  @Column({ name: 'session_id', unique: true })
  sessionId: string;

  /**
   * The ID of the customer associated with the transaction.
   */
  @Column({ name: 'customer_id' })
  customerId: string;

  /**
   * The ID of the payment intent related to the transaction.
   */
  @Column({ name: 'payment_intent_id' })
  paymentIntentId: string;

  /**
   * The amount of the transaction.
   */
  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  /**
   * The currency code of the transaction amount (e.g., "USD").
   */
  @Column({ length: 3 })
  currency: string;

  /**
   * The status of the transaction.
   */
  @Column({ type: 'enum', enum: TransactionStatus, default: TransactionStatus.PENDING })
  status: TransactionStatus;

  /**
   * The number of products associated with the transaction.
   */
  @Column({ name: 'products_count', default: 0 })
  productsCount: number;

  /**
   * The user associated with the transaction.
   */
  @ManyToOne(() => UserEntity, (user) => user.transactions)
  @JoinColumn({ name: 'id_user' })
  user: UserEntity;
}
