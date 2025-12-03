import { CategoryRepository } from "../../../domain/category.respository";
import { CategoryInvalidDataException } from "../../../domain/exceptions/category-invalid-data.exception";
import { CategoryNotFoundException } from "../../../domain/exceptions/category-not-found.exception";
import { CategoryInMemoryRepository } from "../../../infrastructure/category.in-memory-repository";
import { CategoryDeleteDto } from "./dto/category-delete.dto";
import { BaseUseCase } from "@shared/base.use-case";

export class CategoryDeleteUseCase implements BaseUseCase {
    private readonly categoryRepository: CategoryRepository;

    constructor(categoryRepository?: CategoryRepository) {
        this.categoryRepository = categoryRepository || new CategoryInMemoryRepository();
    }

    async execute(request: CategoryDeleteDto): Promise<void> {
        // Validación básica
        if (!request.id) {
            throw new CategoryInvalidDataException("Invalid id");
        }

        // Verificar si la categoría existe
        const existing = await this.categoryRepository.findById(request.id);
        if (!existing) {
            throw new CategoryNotFoundException("id",request.id);
        }

        // Eliminar la categoría
        await this.categoryRepository.delete(request.id);
    }
}
