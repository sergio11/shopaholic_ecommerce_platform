import { AddressEntity } from 'src/modules/address/address.entity';
import { EventSubscriber, EntitySubscriberInterface, InsertEvent, RemoveEvent } from 'typeorm';
import { UsersService } from '../users.service';

/**
 * Event subscriber responsible for updating user address count
 * when addresses are inserted or removed.
 */
@EventSubscriber()
export class AddressSubscriber implements EntitySubscriberInterface<AddressEntity> {
  constructor(private readonly userService: UsersService) {}

  /**
   * Specifies the entity this subscriber listens to.
   */
  listenTo() {
    return AddressEntity;
  }

  /**
   * Handles the afterInsert event of addresses.
   * Increments the user's address count when a new address is inserted.
   * @param event - The InsertEvent containing the inserted address.
   */
  afterInsert(event: InsertEvent<AddressEntity>) {
    this.userService.updateAddressCount(event.entity.user, 1);
  }

  /**
   * Handles the afterRemove event of addresses.
   * Decrements the user's address count when an address is removed.
   * @param event - The RemoveEvent containing the removed address.
   */
  afterRemove(event: RemoveEvent<AddressEntity>) {
    this.userService.updateAddressCount(event.entity.user, -1);
  }
}
