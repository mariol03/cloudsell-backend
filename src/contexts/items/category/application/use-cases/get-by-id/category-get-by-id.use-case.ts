import { CategoryEntity } from "../../../domain/category.entity";
import { CategoryRepository } from "../../../domain/category.respository";
import { CategoryNotFoundException } from "../../../domain/exceptions/category-not-found.exception";
import { CategoryInMemoryRepository } from "../../../infrastructure/category.in-memory-repository";
import { BaseUseCase } from "@shared/base.use-case";
import { CategoryGetByIdDto } from "./dto/category-get-by-id.dto";
import { CategoryInvalidDataException } from "../../../domain/exceptions/category-invalid-data.exception";

export class CategoryGetByIdUseCase extends BaseUseCase{
    private readonly categoryRepository: CategoryRepository;

    constructor(categoryRepository?: CategoryRepository) {
        super();
        this.categoryRepository = categoryRepository || new CategoryInMemoryRepository();
    }

    async execute(request: CategoryGetByIdDto): Promise<CategoryEntity> {
        if (!request || !request.id) {
            console.error(request);
            throw new CategoryInvalidDataException("Invalid id");
        }

        const category = await this.categoryRepository.findById(request.id);
        if (!category) {
            throw new CategoryNotFoundException("id", request.id);
        }
        return category;
    }
}
