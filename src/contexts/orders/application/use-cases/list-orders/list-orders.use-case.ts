import { OrderEntity } from "@contexts/orders/domain/order.entity";
import { OrderRepository } from "@contexts/orders/domain/order.repository";

export class ListOrdersUseCase {
    constructor(private readonly orderRepository: OrderRepository) {}

    async execute(userId: string): Promise<OrderEntity[]> {
        return this.orderRepository.findByOwnerId(userId);
    }
}
