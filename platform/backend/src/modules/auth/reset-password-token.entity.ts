import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from '../users/user.entity';
import { AbstractEntity } from 'src/core/abstract.entity';

/**
 * Entity representing a reset password token.
 */
@Entity({ name: 'reset_password_tokens' })
export class ResetPasswordTokenEntity extends AbstractEntity {
  /**
   * Token for resetting password.
   */
  @Column({ unique: true })
  token: string;

  /**
   * Expiration date of the token.
   */
  @Column({ name: 'expiration_date' })
  expirationDate: Date;

  /**
   * ID of the user associated with the reset token.
   */
  @Column({ name: 'user_id' })
  readonly idUser: string;

  /**
   * User associated with the reset password token.
   */
  @ManyToOne(() => UserEntity, (user) => user.resetPasswordTokens)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
