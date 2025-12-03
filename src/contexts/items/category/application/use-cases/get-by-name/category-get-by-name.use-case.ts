import { CategoryEntity } from "../../../domain/category.entity";
import { CategoryRepository } from "../../../domain/category.respository";
import { CategoryInvalidDataException } from "../../../domain/exceptions/category-invalid-data.exception";
import { CategoryNotFoundException } from "../../../domain/exceptions/category-not-found.exception";
import { CategoryGetByNameDto } from "./dto/category-get-by-name.dto";
import { BaseUseCase } from "@shared/base.use-case";

export class CategoryGetByNameUseCase implements BaseUseCase{
    constructor(private readonly categoryRepository: CategoryRepository) {}
    async execute(request: CategoryGetByNameDto): Promise<CategoryEntity | null> {
        if (!request.name) {
            throw new CategoryInvalidDataException("Invalid name");
        }

        const category = await this.categoryRepository.findByName(request.name);
        
        if (!category) {
            throw new CategoryNotFoundException("name",request.name);
        }
        
        return category;
    }
}
