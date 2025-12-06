import { WishlistRepository } from '../domain/wishlist.repository';
import { WishlistEntity } from '../domain/wishlist.entity';

export class WishlistInMemoryRepository implements WishlistRepository {
  private readonly wishlists: WishlistEntity[] = [];

  async create(wishlist: WishlistEntity): Promise<WishlistEntity> {
    this.wishlists.push(wishlist);
    return wishlist;
  }

  async update(wishlist: WishlistEntity): Promise<WishlistEntity> {
    const idx = this.wishlists.findIndex(w => w.id === wishlist.id);
    if (idx !== -1) this.wishlists[idx] = wishlist;
    return wishlist;
  }

  async delete(wishlist: WishlistEntity): Promise<void> {
    const idx = this.wishlists.findIndex(w => w.id === wishlist.id);
    if (idx !== -1) this.wishlists.splice(idx, 1);
  }

  async findByOwnerId(ownerId: string): Promise<WishlistEntity | null> {
    return this.wishlists.find(w => w.ownerId === ownerId) || null;
  }
}
