import { BaseUseCase } from "@/contexts/shared/base.use-case";
import { InvalidItemDataException } from "@items/domain/exceptions/invalid-item-data.exception";
import { ItemNotFoundException } from "@items/domain/exceptions/item-not-found.exception";
import { ItemEntity } from "@items/domain/item.entity";
import type { ItemRepository } from "@items/domain/item.repository";
import { ItemInMemoryRepository } from "@items/infrastructure/item-inmemory.repository";
import { ItemUpdateDto } from "./dto/item-update.dto";

export class ItemUpdateUseCase implements BaseUseCase {
  private readonly itemRepository: ItemRepository;

  constructor(itemRepository?: ItemRepository) {
    this.itemRepository = itemRepository || new ItemInMemoryRepository();
  }

  async execute(request: ItemUpdateDto): Promise<ItemEntity> {
    if (!request?.id) {
      throw new InvalidItemDataException();
    }
    const item = await this.itemRepository.findById(request.id);
    if (!item) {
      throw new ItemNotFoundException("Id", request.id);
    }
    if (request.name) item.name = request.name;
    if (request.description) item.description = request.description;
    if (request.price !== undefined) item.price = request.price;
    await this.itemRepository.update(item);
    return item;
  }
}