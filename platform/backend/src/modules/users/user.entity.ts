import {
  Entity,
  Column,
  BeforeInsert,
  ManyToMany,
  JoinTable,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { hash } from 'bcrypt';
import { RoleEntity } from 'src/modules/roles/role.entity';
import { AbstractEntity } from 'src/core/abstract.entity';
import { ImageEntity } from '../images/image.entity';
import { AddressEntity } from '../address/address.entity';
import { GenderEnum } from './gender.enum';
import { ProductReviewEntity } from '../products/product-review.entity';
import { TransactionRecordEntity } from '../payments/transaction-record.entity';
import { ResetPasswordTokenEntity } from '../auth/reset-password-token.entity';

@Entity({ name: 'users' })
export class UserEntity extends AbstractEntity {
  /**
   * User's full name.
   */
  @Column({ length: 100 })
  name: string;

  /**
   * User's last name.
   */
  @Column({ length: 100 })
  lastname: string;

  /**
   * User's email (unique).
   */
  @Column({ unique: true })
  email: string;

  /**
   * User's phone number (unique).
   */
  @Column({ nullable: true, unique: true })
  phone?: string;

  /**
   * User's profile image.
   */
  @OneToOne(() => ImageEntity, { cascade: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'image_id' })
  image: ImageEntity;

  /**
   * Hashed password of the user.
   */
  @Column()
  password: string;

  /**
   * Notification token associated with the user.
   */
  @Column({ name: 'notification_token', nullable: true })
  notificationToken: string;

  /**
   * User's city.
   */
  @Column({ nullable: true, length: 100 })
  city?: string;

  /**
   * User's country.
   */
  @Column({ nullable: true, length: 100 })
  country?: string;

  /**
   * is user account enable or disable
   */
  @Column({ name: 'is_enabled', default: true })
  isEnabled: boolean;

  /**
   * User's preferred language.
   */
  @Column({ length: 50 })
  language?: string;

  /**
   * User's birthDate
   */
  @Column({ name: 'birth_date', nullable: true })
  birthDate?: Date;

  /**
   * User's Gender
   */
  @Column({ type: 'enum', enum: GenderEnum, nullable: true })
  gender?: GenderEnum;

  /**
   * Number of reviews made by the user.
   */
  @Column({ name: 'review_count', default: 0 })
  reviewCount: number;

  /**
   * Number of addresses registered by the user.
   */
  @Column({ name: 'address_count', default: 0 })
  addressCount: number;

  /**
   * Addresses associated with this user.
   */
  @OneToMany(() => AddressEntity, (address) => address.user)
  addresses: AddressEntity[];

  /**
   * Reset password tokens associated with the user.
   */
  @OneToMany(
    () => ResetPasswordTokenEntity,
    (resetPasswordToken) => resetPasswordToken.user,
  )
  resetPasswordTokens: ResetPasswordTokenEntity[];

  /**
   * Roles associated with the user.
   */
  @JoinTable({
    name: 'user_has_roles',
    joinColumn: {
      name: 'id_user',
    },
    inverseJoinColumn: {
      name: 'id_rol',
    },
  })
  @ManyToMany(() => RoleEntity, (rol) => rol.users)
  roles: RoleEntity[];

  @OneToMany(() => ProductReviewEntity, (review) => review.user)
  productReviews: ProductReviewEntity[];

  @OneToMany(() => TransactionRecordEntity, (transaction) => transaction.user)
  transactions: TransactionRecordEntity[];

  async updatePassword(newPassword: string) {
    this.password = newPassword;
    await this.hashPassword();
  }

  async comparePassword(plainPassword: string): Promise<boolean> {
    const hashedPlainPassword = await hash(
      plainPassword,
      Number(process.env.HASH_SALT),
    );
    return this.password === hashedPlainPassword;
  }

  /**
   * Hashes the user's password before insertion.
   */
  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password, Number(process.env.HASH_SALT));
  }
}
