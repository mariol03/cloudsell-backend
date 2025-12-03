import { CategoryEntity } from "../../../domain/category.entity";
import { CategoryRepository } from "../../../domain/category.respository";
import { CategoryInMemoryRepository } from "../../../infrastructure/category.in-memory-repository";
import { BaseUseCase } from "@shared/base.use-case";

export class CategoryGetAllUseCase implements BaseUseCase {
    private readonly categoryRepository: CategoryRepository;

    constructor(categoryRepository?: CategoryRepository) {
        this.categoryRepository = categoryRepository || new CategoryInMemoryRepository();
    }

    async execute(): Promise<CategoryEntity[]> {
        // Obtener todas las categorías
        const categories = await this.categoryRepository.findAll();
        return categories;
    }
}
