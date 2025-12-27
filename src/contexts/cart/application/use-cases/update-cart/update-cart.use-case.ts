import { CartRepository } from "@/contexts/cart/domain/cart.repository";
import { CartInMemoryRepository } from "@/contexts/cart/infrastructure/cart-inmemory.repository";
import { BaseUseCase } from "@/contexts/shared/base.use-case";
import { UpdateCartDto } from "./dto/update-cart.dto";
import { CartEntity } from "@/contexts/cart/domain/cart.entity";

export class UpdateCartUseCase implements BaseUseCase {
    private readonly repository: CartRepository;

    constructor(cartRepository: CartRepository) {
        this.repository = cartRepository || new CartInMemoryRepository();
    }

    async execute(request: UpdateCartDto): Promise<CartEntity> {
        const cart = await this.repository.findByUserId(request.userId);
        if (!cart) throw new Error('Cart not found');
        cart.updateQuantity(request.itemId, request.quantity);
        return this.repository.save(cart);
    }
}