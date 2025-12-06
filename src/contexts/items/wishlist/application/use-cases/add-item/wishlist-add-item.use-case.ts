import { WishlistRepository } from '@wishlist/domain/wishlist.repository';
import { WishlistInMemoryRepository } from '@wishlist/infrastructure/wishlist-inmemory.repository';
import { ItemRepository } from '@items/domain/item.repository';
import { ItemInMemoryRepository } from '@items/infrastructure/item-inmemory.repository';

export class WishlistAddItemUseCase {
  private readonly repo: WishlistRepository;
  private readonly itemRepo: ItemRepository;

  constructor(repo?: WishlistRepository, itemRepo?: ItemRepository) {
    this.repo = repo || new WishlistInMemoryRepository();
    this.itemRepo = itemRepo || new ItemInMemoryRepository();
  }

  async execute(ownerId: string, itemId: string) {
    let wishlist = await this.repo.findByOwnerId(ownerId);
    if (!wishlist) {
      // create wishlist automatically
      const { WishlistCreateUseCase } = await import('@wishlist/application/use-cases/create/wishlist-create.use-case');
      wishlist = await new WishlistCreateUseCase(this.repo).execute(ownerId);
    }
    const item = await this.itemRepo.findById(itemId);
    if (!item) throw new Error('ItemNotFound');
    wishlist.addItem(item);
    await this.repo.update(wishlist);
    return wishlist;
  }
}
