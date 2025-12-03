import { CategoryRepository } from "@items/category/domain/category.respository";
import { ItemNotFoundException } from "@/contexts/items/domain/exceptions/item-not-found.exception";
import { ItemRepository } from "@/contexts/items/domain/item.repository";
import { DeleteCategoryDto } from "./dto/delete-category.dto";
import { CategoryNotFoundException } from "@items/category/domain/exceptions/category-not-found.exception";

export class DeleteCategoryUseCase {
    private readonly itemRepository?: ItemRepository;
    private readonly categoryRepository?: CategoryRepository;

    constructor(
        itemRepository?: ItemRepository,
        categoryRepository?: CategoryRepository    
    ) {
        this.itemRepository = itemRepository;
        this.categoryRepository = categoryRepository;
    }

    async execute(dto: DeleteCategoryDto): Promise<void> {
    const item = await this.itemRepository!.findById(dto.item.id);
        if (!item) {
            throw new ItemNotFoundException('id', dto.item.id);
        }

    const category = await this.categoryRepository!.findById(dto.category.id);
        if (!category) {
            throw new CategoryNotFoundException('id', dto.category.id);
        }

        item.deleteCategory(category);
    }
}