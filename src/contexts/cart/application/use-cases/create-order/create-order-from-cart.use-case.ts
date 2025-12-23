import { CartRepository } from '@contexts/cart/domain/cart.repository';
import { CartInMemoryRepository } from '@contexts/cart/infrastructure/cart-inmemory.repository';
import { OrderRepository } from '@contexts/cart/domain/order.repository';
import { OrderInMemoryRepository } from '@contexts/cart/infrastructure/order-inmemory.repository';
import { OrderEntity, OrderItem } from '@contexts/cart/domain/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';

export class CreateOrderFromCartUseCase {
  private readonly cartRepo: CartRepository;
  private readonly orderRepo: OrderRepository;

  constructor(cartRepo?: CartRepository, orderRepo?: OrderRepository) {
    this.cartRepo = cartRepo || new CartInMemoryRepository();
    this.orderRepo = orderRepo || new OrderInMemoryRepository();
  }

  async execute(body: CreateOrderDto) {
    const cart = await this.cartRepo.findByOwnerId(body.ownerId);
    if (!cart || cart.items.length === 0) throw new Error('CartEmpty');

    const orderItems: OrderItem[] = cart.items.map(i => ({ item: i.item, quantity: i.quantity, price: i.item.price }));
    const order = new OrderEntity(body.ownerId, orderItems);
    await this.orderRepo.save(order);

    // Clear cart after creating order
    cart.clear();
    await this.cartRepo.save(cart);

    return order;
  }
}
