import { BaseUseCase } from "@shared/base.use-case";
import { ItemDeleteDto } from "./dto/item-delete.dto";
import { ItemEntity } from "@items/domain/item.entity";
import type { ItemRepository } from "@items/domain/item.repository";
import { ItemInMemoryRepository } from "@items/infrastructure/item-inmemory.repository";
import { InvalidItemDataException } from "@items/domain/exceptions/invalid-item-data.exception";
import { ItemNotFoundException } from "@items/domain/exceptions/item-not-found.exception";

export class ItemDeleteUseCase extends BaseUseCase {
  private readonly itemRepository: ItemRepository;

  constructor(itemRepository?: ItemRepository) {
    super();
    this.itemRepository = itemRepository || new ItemInMemoryRepository();
  }

  async execute(request: ItemDeleteDto): Promise<ItemEntity | null> {
    if (!request?.id) {
      throw new InvalidItemDataException();
    }
    
    const item = await this.itemRepository.findById(request.id);
    if (!item) {
      throw new ItemNotFoundException("Id", request.id);
    }

    await this.itemRepository.delete(item);
    return item;
  }
}