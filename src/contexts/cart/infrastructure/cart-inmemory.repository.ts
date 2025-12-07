import { CartRepository } from '@contexts/cart/domain/cart.repository';
import { CartEntity } from '@contexts/cart/domain/cart.entity';

export class CartInMemoryRepository implements CartRepository {
  private readonly carts: CartEntity[] = [];

  async save(cart: CartEntity): Promise<CartEntity> {
    const idx = this.carts.findIndex(c => c.id === cart.id);
    if (idx === -1) this.carts.push(cart);
    else this.carts[idx] = cart;
    return cart;
  }

  async findByOwnerId(ownerId: string): Promise<CartEntity | undefined> {
    return this.carts.find(c => c.ownerId === ownerId);
  }

  async deleteById(id: string): Promise<void> {
    const idx = this.carts.findIndex(c => c.id === id);
    if (idx !== -1) this.carts.splice(idx, 1);
  }
}
