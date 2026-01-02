import { CartRepository } from "@cart/domain/cart.repository";
import { CartInMemoryRepository } from "@cart/infrastructure/cart-inmemory.repository";
import { CartEntity } from "@cart/domain/cart.entity";
import { RemoveFromCartDto } from "./dto/remote-from-cart.dto";

export class RemoveFromCartUseCase {
    private readonly repo: CartRepository;

    constructor(repo?: CartRepository) {
        this.repo = repo || new CartInMemoryRepository();
    }

    async execute(body: RemoveFromCartDto): Promise<CartEntity> {
        const cart = await this.repo.findByUserId(body.userId);
        if (!cart) throw new Error("CartNotFound");
        cart.removeItem(body.itemId);
        const newCart = await this.repo.save(cart);
        return newCart;
    }
}
