import { OrderEntity } from "./order.entity";

export interface OrderRepository {
  save(order: OrderEntity): Promise<OrderEntity>;
  findById(id: string): Promise<OrderEntity | undefined>;
  findByUserId(userId: string): Promise<OrderEntity[]>;
}
