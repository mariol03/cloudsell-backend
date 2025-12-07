import { OrderRepository } from '@contexts/cart/domain/order.repository';
import { OrderEntity } from '@contexts/cart/domain/order.entity';

export class OrderInMemoryRepository implements OrderRepository {
  private readonly orders: OrderEntity[] = [];

  async save(order: OrderEntity): Promise<OrderEntity> {
    const idx = this.orders.findIndex(o => o.id === order.id);
    if (idx === -1) this.orders.push(order);
    else this.orders[idx] = order;
    return order;
  }

  async findById(id: string): Promise<OrderEntity | undefined> {
    return this.orders.find(o => o.id === id);
  }

  async findByOwnerId(ownerId: string): Promise<OrderEntity[]> {
    return this.orders.filter(o => o.ownerId === ownerId);
  }
}
