import { CartRepository } from '@contexts/cart/domain/cart.repository';
import { CartInMemoryRepository } from '@contexts/cart/infrastructure/cart-inmemory.repository';
import { CartEntity } from '@contexts/cart/domain/cart.entity';
import { RemoveFromCartDto } from './dto/remote-from-cart.dto';

export class RemoveFromCartUseCase {
  private readonly repo: CartRepository;

  constructor(repo?: CartRepository) {
    this.repo = repo || new CartInMemoryRepository();
  }

  async execute(body: RemoveFromCartDto): Promise<CartEntity> {
    const cart = await this.repo.findByOwnerId(body.ownerId);
    if (!cart) throw new Error('CartNotFound');
    cart.removeItem(body.itemId);
    await this.repo.save(cart);
    return cart;
  }
}
