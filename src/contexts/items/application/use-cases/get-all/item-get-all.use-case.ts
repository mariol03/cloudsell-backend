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
    constructor(
        private readonly itemRepository: ItemRepository = new ItemInMemoryRepository(),
    ) {
        super();
    }

    async execute(filters: ItemGetAllDto = {}): Promise<ItemEntity[]> {
        const items = await this.itemRepository.findAll();
        const nonNullableItems = items.filter((item): item is ItemEntity => !!item);

        const filtered = this.applyFilters(nonNullableItems, filters);
        return this.paginate(filtered, filters.page, filters.pageSize);
    }

    private applyFilters(items: ItemEntity[], filters: ItemGetAllDto): ItemEntity[] {
        const { categoryId, minPrice, maxPrice } = filters;

        return items.filter((item) => {
            const matchesCategory = !categoryId || item.category?.some((c) => c.id === categoryId);
            const matchesMinPrice = minPrice === undefined || (item.price ?? 0) >= minPrice;
            const matchesMaxPrice = maxPrice === undefined || (item.price ?? 0) <= maxPrice;

            return matchesCategory && matchesMinPrice && matchesMaxPrice;
        });
    }

    private paginate(items: ItemEntity[], page: number = 1, pageSize?: number): ItemEntity[] {
        const size = pageSize && pageSize > 0 ? pageSize : items.length;
        const start = (Math.max(1, page) - 1) * size;
        return items.slice(start, start + size);
    }
}
