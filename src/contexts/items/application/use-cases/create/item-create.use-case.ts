import { BaseUseCase } from "@shared/base.use-case";
import { InvalidItemDataException } from "@items/domain/exceptions/invalid-item-data.exception";
import { ItemAlreadyExistsException } from "@items/domain/exceptions/item-already-exists.exception";
import { ItemEntity } from "@items/domain/item.entity";
import type { ItemRepository } from "@items/domain/item.repository";
import { ItemInMemoryRepository } from "@items/infrastructure/item-inmemory.repository";
import { ItemCreateDto } from "./dto/item-create.dto";

export class ItemCreateUseCase extends BaseUseCase {
    private readonly itemRepository: ItemRepository;

    constructor(itemRepository?: ItemRepository) {
        super();
        this.itemRepository = itemRepository || new ItemInMemoryRepository();
    }

    async execute(request: ItemCreateDto): Promise<ItemEntity> {
        if (
            !request?.name ||
            !request?.description ||
            !request?.image ||
            !request?.price
        ) {
            throw new InvalidItemDataException();
        }

        const existingItem = await this.itemRepository.findByName(request.name);
        if (existingItem) {
            throw new ItemAlreadyExistsException("name", request.name);
        }

        const newItem = new ItemEntity(
            request.name,
            request.description,
            request.image,
            request.price,
        );
        await this.itemRepository.create(newItem);
        return newItem;
    }
}
