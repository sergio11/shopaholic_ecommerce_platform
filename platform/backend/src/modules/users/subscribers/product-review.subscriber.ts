import { ProductReviewEntity } from 'src/modules/products/product-review.entity';
import { EventSubscriber, EntitySubscriberInterface, InsertEvent, RemoveEvent, Repository } from 'typeorm';
import { UsersService } from '../users.service';

/**
 * Event subscriber responsible for updating user review count
 * when product reviews are inserted or removed.
 */
@EventSubscriber()
export class ProductReviewSubscriber implements EntitySubscriberInterface<ProductReviewEntity> {
  constructor(private readonly userService: UsersService) {}

  /**
   * Specifies the entity this subscriber listens to.
   */
  listenTo() {
    return ProductReviewEntity;
  }

  /**
   * Handles the afterInsert event of product reviews.
   * Increments the user's review count when a new review is inserted.
   * @param event - The InsertEvent containing the inserted product review.
   */
  afterInsert(event: InsertEvent<ProductReviewEntity>) {
    this.userService.updateReviewCount(event.entity.user, 1);
  }

  /**
   * Handles the afterRemove event of product reviews.
   * Decrements the user's review count when a review is removed.
   * @param event - The RemoveEvent containing the removed product review.
   */
  afterRemove(event: RemoveEvent<ProductReviewEntity>) {
    this.userService.updateReviewCount(event.entity.user, -1);
  }
}
