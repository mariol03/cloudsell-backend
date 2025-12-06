import { WishlistRepository } from '@wishlist/domain/wishlist.repository';
import { WishlistInMemoryRepository } from '@wishlist/infrastructure/wishlist-inmemory.repository';

export class WishlistRemoveItemUseCase {
  private readonly repo: WishlistRepository;

  constructor(repo?: WishlistRepository) {
    this.repo = repo || new WishlistInMemoryRepository();
  }

  async execute(ownerId: string, itemId: string) {
    const wishlist = await this.repo.findByOwnerId(ownerId);
    if (!wishlist) throw new Error('WishlistNotFound');
    wishlist.removeItem(itemId);
    await this.repo.update(wishlist);
    return wishlist;
  }
}
