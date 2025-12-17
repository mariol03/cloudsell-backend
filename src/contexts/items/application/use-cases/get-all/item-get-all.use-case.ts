import { ItemEntity } from "@items/domain/item.entity";
import type { ItemRepository } from "@items/domain/item.repository";
import { ItemInMemoryRepository } from "@items/infrastructure/item-inmemory.repository";
import { BaseUseCase } from "@shared/base.use-case";

export interface ItemGetAllDto {
    categoryId?: string;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    pageSize?: number;
}

export class ItemGetAllCase extends BaseUseCase {
    private readonly itemRepository: ItemRepository;

    constructor(itemRepository?: ItemRepository) {
        super();
        this.itemRepository = itemRepository || new ItemInMemoryRepository();
    }

    async execute(filters?: ItemGetAllDto): Promise<Array<ItemEntity>> {
        const all = await this.itemRepository.findAll();

        let result = all;

        if (filters) {
            if (filters.categoryId) {
                result = result.filter((i) =>
                    (i.category || []).some(
                        (c) => c.id === filters!.categoryId,
                    ),
                );
            }
            if (filters.minPrice !== undefined) {
                result = result.filter(
                    (i) => (i.price ?? 0) >= filters!.minPrice!,
                );
            }
            if (filters.maxPrice !== undefined) {
                result = result.filter(
                    (i) => (i.price ?? 0) <= filters!.maxPrice!,
                );
            }
            // pagination
            const page = filters.page && filters.page > 0 ? filters.page : 1;
            const pageSize =
                filters.pageSize && filters.pageSize > 0
                    ? filters.pageSize
                    : result.length;
            const start = (page - 1) * pageSize;
            result = result.slice(start, start + pageSize);
        }

        return result;
    }
}
