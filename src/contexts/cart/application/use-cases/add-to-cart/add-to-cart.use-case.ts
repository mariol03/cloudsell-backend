import { CartRepository } from '@contexts/cart/domain/cart.repository';
import { CartInMemoryRepository } from '@contexts/cart/infrastructure/cart-inmemory.repository';
import { ItemRepository } from '@items/domain/item.repository';
import { ItemInMemoryRepository } from '@items/infrastructure/item-inmemory.repository';
import { CartEntity } from '@contexts/cart/domain/cart.entity';
import { ItemEntity } from '@items/domain/item.entity';
import { AddToCartDto } from './dto/add-to-card.dto';

export class AddToCartUseCase {
  private readonly repo: CartRepository;
  private readonly itemRepo: ItemRepository;

  constructor(repo?: CartRepository, itemRepo?: ItemRepository) {
    this.repo = repo || new CartInMemoryRepository();
    this.itemRepo = itemRepo || new ItemInMemoryRepository();
  }

  async execute(body: AddToCartDto): Promise<CartEntity> {
    let cart = await this.repo.findByUserId(body.userId);
    if (!cart) {
      cart = new CartEntity(body.userId);
    }
    const item = await this.itemRepo.findById(body.itemId);
    if (!item) throw new Error('ItemNotFound');
    cart.addItem(item as ItemEntity, body.quantity);
    await this.repo.save(cart);
    return cart;
  }
}
