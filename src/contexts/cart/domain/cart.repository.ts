import { CartEntity } from './cart.entity';

export interface CartRepository {
  save(cart: CartEntity): Promise<CartEntity>;
  findByUserId(userId: string): Promise<CartEntity | undefined>;
  deleteById(id: string): Promise<void>;
}
