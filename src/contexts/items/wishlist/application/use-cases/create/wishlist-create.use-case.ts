import { WishlistRepository } from '@wishlist/domain/wishlist.repository';
import { WishlistInMemoryRepository } from '@wishlist/infrastructure/wishlist-inmemory.repository';
import { WishlistEntity } from '@wishlist/domain/wishlist.entity';

export class WishlistCreateUseCase {
  private readonly repo: WishlistRepository;

  constructor(repo?: WishlistRepository) {
    this.repo = repo || new WishlistInMemoryRepository();
  }

  async execute(ownerId: string): Promise<WishlistEntity> {
    const existing = await this.repo.findByOwnerId(ownerId);
    if (existing) return existing;
    const wishlist = new WishlistEntity(ownerId);
    await this.repo.create(wishlist);
    return wishlist;
  }
}
