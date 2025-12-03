import { ItemEntity } from "@/contexts/items/domain/item.entity";
import { ItemRepository } from "@/contexts/items/domain/item.repository";
import { CategoryRepository } from "../../../category/domain/category.respository";
import { ItemInMemoryRepository } from "@items/infrastructure/item-inmemory.repository";
import { CategoryInMemoryRepository } from "../../../category/infrastructure/category.in-memory-repository";
import { AddCategoryDto } from "./dto/add-category.dto";
import { BaseUseCase } from "@/contexts/shared/base.use-case";
import { ItemNotFoundException } from "@/contexts/items/domain/exceptions/item-not-found.exception";
import { CategoryNotFoundException } from "../../../category/domain/exceptions/category-not-found.exception";

export class AddCategoryToItemUseCase implements BaseUseCase {
    private readonly itemRepository: ItemRepository;
    private readonly categoryRepository: CategoryRepository;

    constructor(
        itemRepository?: ItemRepository,
        categoryRepository?: CategoryRepository
    ) {
        this.itemRepository = itemRepository || new ItemInMemoryRepository();
        this.categoryRepository = categoryRepository || new CategoryInMemoryRepository();
    }

    async execute(request: AddCategoryDto): Promise<ItemEntity> {
        // Buscar el ítem por ID
        const item = await this.itemRepository.findById(request.item.id);
        if (!item) {
            throw new ItemNotFoundException("id",request.item.id);
        }
        
        // Buscar la categoría por ID
        const category = await this.categoryRepository.findById(request.category.id);
        if (!category) {
            throw new CategoryNotFoundException("id",request.category.id);
        }

        item.addCategory(category);
        
        // Actualizar el ítem con la nueva categoría
        return this.itemRepository.update(item);
    }
}