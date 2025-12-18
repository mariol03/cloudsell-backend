import { ItemEntity } from "@/contexts/items/domain/item.entity";
import { ItemRepository } from "@/contexts/items/domain/item.repository";
import { ItemInMemoryRepository } from "@/contexts/items/infrastructure/item-inmemory.repository";
import { BaseUseCase } from "@/contexts/shared/base.use-case";
import { UserRepository } from "@/contexts/users/domain/user.repository";
import { UserInMemoryRepository } from "@/contexts/users/infrastructure/user-inmemory.repository";
import { ItemGetByUserIdDto } from "./dto/item-get-by-userid.dto";
import { InvalidItemDataException } from "@/contexts/items/domain/exceptions/invalid-item-data.exception";
import { UserEntity } from "@/contexts/users/domain/user.entity";
import { UserNotFoundException } from "@/contexts/users/domain/exceptions/user-not-found.exception";
import { JwtTokenService } from "@/contexts/users/infrastructure/jwt-token.service";
import { getLogger } from "@/contexts/shared/infrastructure/logger/singleton.logger";

export class ItemGetByUserIdUseCase extends BaseUseCase {
    private readonly itemRepository: ItemRepository;

    constructor(itemRepository: ItemRepository) {
        super();
        this.itemRepository = itemRepository || new ItemInMemoryRepository();
    }

    async execute(params: ItemGetByUserIdDto): Promise<Array<ItemEntity>> {
        // Comprobar que se ha introducido algo en la solicitud
        if (!params?.userId) {
            throw new InvalidItemDataException();
        }

        const items = await this.itemRepository.findByUserId(params.userId);
        return items;
    }
}
