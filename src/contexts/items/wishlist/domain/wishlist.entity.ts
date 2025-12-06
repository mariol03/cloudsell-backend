import { BaseEntity } from '@shared/base.entity';
import { ItemEntity } from '@items/domain/item.entity';

export class WishlistEntity extends BaseEntity {
  ownerId: string;
  items: ItemEntity[] = [];

  constructor(ownerId: string) {
    super();
    this.ownerId = ownerId;
  }

  addItem(item: ItemEntity) {
    if (!this.items.some(i => i.id === item.id)) {
      this.items.push(item);
    }
  }

  removeItem(itemId: string) {
    this.items = this.items.filter(i => i.id !== itemId);
  }
}
