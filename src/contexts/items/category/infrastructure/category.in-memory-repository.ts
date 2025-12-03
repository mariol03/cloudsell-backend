import { CategoryEntity } from "../domain/category.entity";
import { CategoryRepository } from "../domain/category.respository";
import { CategoryNotFoundException } from "../domain/exceptions/category-not-found.exception";

export class CategoryInMemoryRepository implements CategoryRepository {
    private categories: CategoryEntity[] = [];
    
    async create(category: CategoryEntity): Promise<CategoryEntity> {
        this.categories.push(category);
        return category;
    }
    async findById(id: string): Promise<CategoryEntity | null> {
        const category = this.categories.find(cat => cat.id === id);
        return category || null;
    }

    async findByName(name: string): Promise<CategoryEntity | null> {
        const category = this.categories.find(cat => cat.name === name);
        return category || null;
    }
    
    async findAll(): Promise<CategoryEntity[]> {
        return this.categories;
    }
    
    async update(category: CategoryEntity): Promise<CategoryEntity> {
        const index = this.categories.findIndex(cat => cat.id === category.id);
        if (index !== -1) {
            this.categories[index] = category;
            return category;
        }
        throw new CategoryNotFoundException("id",category.id);
    }
    
    async delete(id: string): Promise<void> {
        const index = this.categories.findIndex(cat => cat.id === id);
        if (index !== -1) {
            this.categories.splice(index, 1);
        } else {
            throw new CategoryNotFoundException("id",id);
        }
    }
}   
