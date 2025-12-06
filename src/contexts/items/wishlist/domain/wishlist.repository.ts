import { WishlistEntity } from './wishlist.entity';

export interface WishlistRepository {
  create(wishlist: WishlistEntity): Promise<WishlistEntity>;
  update(wishlist: WishlistEntity): Promise<WishlistEntity>;
  delete(wishlist: WishlistEntity): Promise<void>;
  findByOwnerId(ownerId: string): Promise<WishlistEntity | null>;
}
