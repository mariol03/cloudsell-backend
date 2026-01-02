import { CartRepository } from "@contexts/cart/domain/cart.repository";
import { CartInMemoryRepository } from "@contexts/cart/infrastructure/cart-inmemory.repository";
import { OrderRepository } from "../../../domain/order.repository";
import { OrderInMemoryRepository } from "../../../infrastructure/order-inmemory.repository";
import { OrderEntity, OrderItem } from "../../../domain/order.entity";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UserRepository } from "@contexts/users/domain/user.repository";
import { UserInMemoryRepository } from "@contexts/users/infrastructure/user-inmemory.repository";
import { BuyerStats } from "@contexts/users/domain/buyer.stats";

export class CreateOrderFromCartUseCase {
    private readonly cartRepo: CartRepository;
    private readonly orderRepo: OrderRepository;
    private readonly userRepo: UserRepository;

    constructor(
        cartRepo?: CartRepository,
        orderRepo?: OrderRepository,
        userRepo?: UserRepository,
    ) {
        this.cartRepo = cartRepo || new CartInMemoryRepository();
        this.orderRepo = orderRepo || new OrderInMemoryRepository();
        this.userRepo = userRepo || new UserInMemoryRepository();
    }

    async execute(body: CreateOrderDto) {
        const cart = await this.cartRepo.findByUserId(body.userId);
        if (!cart || cart.items.length === 0) throw new Error("CartEmpty");

        const orderItems: OrderItem[] = cart.items.map((i) => ({
            item: i.item,
            quantity: i.quantity,
            price: i.item.price,
        }));
        const order = new OrderEntity(body.userId, orderItems);
        await this.orderRepo.save(order);

        // Update user stats
        const user = await this.userRepo.findById(body.userId);
        if (user) {
            if (!user.buyerStats) {
                user.buyerStats = BuyerStats.createDefault(user.id);
            }

            user.buyerStats.purchasesCount += 1;
            user.buyerStats.totalSpent += cart.items.reduce(
                (acc, i) => acc + i.item.price * i.quantity,
                0,
            );
            await this.userRepo.save(user);
        }

        // Clear cart after creating order
        cart.clear();
        await this.cartRepo.save(cart);

        return order;
    }
}
