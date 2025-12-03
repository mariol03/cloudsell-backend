import { CategoryEntity } from "../../../domain/category.entity";
import { CategoryRepository } from "../../../domain/category.respository";
import { CategoryAlreadyFoundException } from "../../../domain/exceptions/category-already-found.exception";
import { CategoryInvalidDataException } from "../../../domain/exceptions/category-invalid-data.exception";
import { CategoryInMemoryRepository } from "../../../infrastructure/category.in-memory-repository";
import { CategoryCreateDto } from "./dto/category-create.dto";
import { BaseUseCase } from "@shared/base.use-case";

export class CategoryCreator implements BaseUseCase {
    private readonly categoryRepository: CategoryRepository;

    constructor(categoryRepository?: CategoryRepository) {
        this.categoryRepository = categoryRepository || new CategoryInMemoryRepository();
    }

    async execute(request: CategoryCreateDto): Promise<CategoryEntity> {
        if (!request.name) {
            throw new CategoryInvalidDataException("Nombre de categoría es obligatorio");
        }

        // Verificar si la categoría ya existe
        const existing = await this.categoryRepository.findByName(request.name);
        if (existing) {
            throw new CategoryAlreadyFoundException("name",request.name);
        }

        // Crear entidad y guardar
        const category = new CategoryEntity(
            request.name,
            request.description || ""
        );

        return await this.categoryRepository.create(category);
    }
}   
