import { CartRepository } from '@contexts/cart/domain/cart.repository';
import { CartInMemoryRepository } from '@contexts/cart/infrastructure/cart-inmemory.repository';
import { ItemRepository } from '@items/domain/item.repository';
import { ItemInMemoryRepository } from '@items/infrastructure/item-inmemory.repository';
import { CartEntity } from '@contexts/cart/domain/cart.entity';
import { ItemEntity } from '@items/domain/item.entity';

export class AddToCartUseCase {
  private readonly repo: CartRepository;
  private readonly itemRepo: ItemRepository;

  constructor(repo?: CartRepository, itemRepo?: ItemRepository) {
    this.repo = repo || new CartInMemoryRepository();
    this.itemRepo = itemRepo || new ItemInMemoryRepository();
  }

  async execute(ownerId: string, itemId: string, quantity = 1): Promise<CartEntity> {
    let cart = await this.repo.findByOwnerId(ownerId);
    if (!cart) {
      cart = new CartEntity(ownerId);
    }
    const item = await this.itemRepo.findById(itemId);
    if (!item) throw new Error('ItemNotFound');
    cart.addItem(item as ItemEntity, quantity);
    await this.repo.save(cart);
    return cart;
  }
}
