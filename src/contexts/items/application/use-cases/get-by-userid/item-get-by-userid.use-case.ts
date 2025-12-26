import { ItemEntity } from "@/contexts/items/domain/item.entity";
import { ItemRepository } from "@/contexts/items/domain/item.repository";
import { ItemInMemoryRepository } from "@/contexts/items/infrastructure/item-inmemory.repository";
import { BaseUseCase } from "@/contexts/shared/base.use-case";
import { ItemGetByUserIdDto } from "./dto/item-get-by-userid.dto";
import { InvalidItemDataException } from "@/contexts/items/domain/exceptions/invalid-item-data.exception";

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
