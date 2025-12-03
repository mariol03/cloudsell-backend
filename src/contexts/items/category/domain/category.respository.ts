import { CategoryEntity } from "./category.entity";

export interface CategoryRepository {
    create(category: CategoryEntity): Promise<CategoryEntity>;
    findById(id: string): Promise<CategoryEntity | null>;
    findByName(name: string): Promise<CategoryEntity | null>;
    findAll(): Promise<CategoryEntity[]>;
    update(category: CategoryEntity): Promise<CategoryEntity>;
    delete(id: string): Promise<void>;
}
