import { ItemRepository } from "@/contexts/items/domain/item.repository";
import { ItemInMemoryRepository } from "@/contexts/items/infrastructure/item-inmemory.repository";
import { BaseUseCase } from "@/contexts/shared/base.use-case";
import { ItemGetByNameDto } from "./dto/item-get-by-name.dto";
import { ItemEntity } from "@/contexts/items/domain/item.entity";
import { InvalidItemDataException } from "@/contexts/items/domain/exceptions/invalid-item-data.exception";
import { ItemNotFoundException } from "@/contexts/items/domain/exceptions/item-not-found.exception";


export class ItemGetByNameCase extends BaseUseCase {
    private readonly itemRepository: ItemRepository;
    
    constructor(itemRepository?: ItemRepository) {
        super();
        this.itemRepository = itemRepository || new ItemInMemoryRepository();
    }

    async execute(request?: ItemGetByNameDto): Promise<ItemEntity> {
        if (!request?.name) {
            throw new InvalidItemDataException();
        }

        const item = await this.itemRepository.findByName(request.name);
        if (!item) {
            throw new ItemNotFoundException("name", request.name);
        }

        return item;
    }
}