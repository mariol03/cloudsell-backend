import { CartRepository } from '@contexts/cart/domain/cart.repository';
import { CartInMemoryRepository } from '@contexts/cart/infrastructure/cart-inmemory.repository';
import { CartEntity } from '@contexts/cart/domain/cart.entity';

export class RemoveFromCartUseCase {
  private readonly repo: CartRepository;

  constructor(repo?: CartRepository) {
    this.repo = repo || new CartInMemoryRepository();
  }

  async execute(ownerId: string, itemId: string): Promise<CartEntity> {
    const cart = await this.repo.findByOwnerId(ownerId);
    if (!cart) throw new Error('CartNotFound');
    cart.removeItem(itemId);
    await this.repo.save(cart);
    return cart;
  }
}
