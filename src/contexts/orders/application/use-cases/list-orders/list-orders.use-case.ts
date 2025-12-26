import { OrderEntity } from "@contexts/orders/domain/order.entity";
import { OrderRepository } from "@contexts/orders/domain/order.repository";
import { ListOrdersDto } from "./dto/list-orders.dto";

export class ListOrdersUseCase {
    constructor(private readonly orderRepository: OrderRepository) {}

    async execute(dto: ListOrdersDto): Promise<OrderEntity[]> {
        return this.orderRepository.findByOwnerId(dto.ownerId);
    }
}
