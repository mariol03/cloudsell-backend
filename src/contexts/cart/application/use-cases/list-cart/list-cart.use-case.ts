import { CartRepository } from "@/contexts/cart/domain/cart.repository";
import { CartInMemoryRepository } from "@/contexts/cart/infrastructure/cart-inmemory.repository";
import { BaseUseCase } from "@/contexts/shared/base.use-case";
import { ListCartDto } from "./dto/list-cart.dto";

export class ListCartUseCase extends BaseUseCase {
    private readonly cartRepository: CartRepository;

    constructor(cartRepository: CartRepository) {
        super();
        this.cartRepository = cartRepository || new CartInMemoryRepository();
    }

    async execute(body: ListCartDto) {
        const cart = await this.cartRepository.findByUserId(body.userId);
        return cart;
    }
}