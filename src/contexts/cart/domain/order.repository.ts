import { OrderEntity } from './order.entity';

export interface OrderRepository {
  save(order: OrderEntity): Promise<OrderEntity>;
  findById(id: string): Promise<OrderEntity | undefined>;
  findByOwnerId(ownerId: string): Promise<OrderEntity[]>;
}
