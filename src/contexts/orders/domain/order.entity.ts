import { BaseEntity } from '@shared/base.entity';
import { ItemEntity } from '@items/domain/item.entity';

export type OrderItem = {
  item: ItemEntity;
  quantity: number;
  price?: number;
};

export enum OrderStatus {
  CREATED = 'created',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled'
}

export class OrderEntity extends BaseEntity {
  userId: string;
  items: OrderItem[] = [];
  total: number = 0;
  status: OrderStatus = OrderStatus.CREATED;

  constructor(userId: string, items: OrderItem[] = []) {
    super();
    this.userId = userId;
    this.items = items;
    this.total = this.calculateTotal();
  }

  calculateTotal(): number {
    return this.items.reduce((acc, it) => acc + ((it.price ?? it.item.price ?? 0) * it.quantity), 0);
  }
}
