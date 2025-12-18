import { InvalidItemDataException } from "@/contexts/items/domain/exceptions/invalid-item-data.exception";
import { ItemNotFoundException } from "@/contexts/items/domain/exceptions/item-not-found.exception";
import { ItemEntity } from "@/contexts/items/domain/item.entity";
import type { ItemRepository } from "@/contexts/items/domain/item.repository";
import { ItemInMemoryRepository } from "@/contexts/items/infrastructure/item-inmemory.repository";
import { BaseUseCase } from "@/contexts/shared/base.use-case";
import { ItemGetByIdDto } from "./dto/item-get-by-id.dto";

export class ItemGetByIdCase extends BaseUseCase {
    private readonly itemRepository: ItemRepository;

    constructor(itemRepository?: ItemRepository) {
        super();
        this.itemRepository = itemRepository || new ItemInMemoryRepository();
    }

    async execute(params?: ItemGetByIdDto): Promise<ItemEntity | null> {
        if (!params?.id) {
            throw new InvalidItemDataException();
        }

        const item = await this.itemRepository.findById(params.id);
        if (!item) {
            throw new ItemNotFoundException("Id", params.id);
        }

        return item;
    }
}
