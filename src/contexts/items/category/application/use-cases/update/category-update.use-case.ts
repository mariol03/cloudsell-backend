import { CategoryEntity } from "../../../domain/category.entity";
import { CategoryRepository } from "../../../domain/category.respository";
import { CategoryInvalidDataException } from "../../../domain/exceptions/category-invalid-data.exception";
import { CategoryNotFoundException } from "../../../domain/exceptions/category-not-found.exception";
import { CategoryInMemoryRepository } from "../../../infrastructure/category.in-memory-repository";
import { BaseUseCase } from "@shared/base.use-case";
import { CategoryUpdateDto } from "./dto/category-update.dto";

export class CategoryUpdateUseCase extends BaseUseCase{
    private readonly categoryRepository: CategoryRepository;

    constructor(categoryRepository?: CategoryRepository) {
        super();
        this.categoryRepository = categoryRepository || new CategoryInMemoryRepository();
    }

    async execute(request: CategoryUpdateDto): Promise<CategoryEntity> {
        if (!request.id) {
            throw new CategoryInvalidDataException();
        }

        // retrieve the category by ID
        const category = await this.categoryRepository.findById(request.id);
        if (!category) {
            throw new CategoryNotFoundException("id", request.id);
        }

        // Update the category properties
        category.description = request.description || category.description;
        category.name = request.name || category.name;
        return this.categoryRepository.update(category);
    }
}
