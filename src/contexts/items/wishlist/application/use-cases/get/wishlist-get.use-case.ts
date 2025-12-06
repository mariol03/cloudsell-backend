import { WishlistRepository } from '@wishlist/domain/wishlist.repository';
import { WishlistInMemoryRepository } from '@wishlist/infrastructure/wishlist-inmemory.repository';

export class WishlistGetUseCase {
  private readonly repo: WishlistRepository;

  constructor(repo?: WishlistRepository) {
    this.repo = repo || new WishlistInMemoryRepository();
  }

  async execute(ownerId: string) {
    const wishlist = await this.repo.findByOwnerId(ownerId);
    return wishlist;
  }
}
