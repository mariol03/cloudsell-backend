import { ItemEntity } from "@/contexts/items/domain/item.entity";
import type { ItemRepository } from "@/contexts/items/domain/item.repository";
import { ItemInMemoryRepository } from "@/contexts/items/infrastructure/item-inmemory.repository";
import { BaseUseCase } from "@/contexts/shared/base.use-case";

export class ItemGetAllCase extends BaseUseCase {
    private readonly itemRepository: ItemRepository;
    
    constructor(itemRepository?:ItemRepository) {
        super();
        this.itemRepository = itemRepository || new ItemInMemoryRepository();
    }

    async execute(): Promise<Array<ItemEntity>> {
        const items = this.itemRepository.findAll();
        return items;
    }
}