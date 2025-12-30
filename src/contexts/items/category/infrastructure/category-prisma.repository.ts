import { prisma } from "@/contexts/shared/infrastructure/prisma-singletons";
import { CategoryEntity } from "../domain/category.entity";
import { CategoryRepository } from "../domain/category.respository";
import { Category } from "@/contexts/shared/infrastructure/prisma/client";

export class CategoryPrismaRepository implements CategoryRepository {
    async create(category: CategoryEntity): Promise<CategoryEntity> {
        const newCategory = await prisma.category.create({
            data: {
                name: category.name,
                createdBy: category.createdBy,
                updatedBy: category.updatedBy,
            },
        });
        return this.toCategoryEntity(newCategory);
    }
    async findById(id: string): Promise<CategoryEntity | null> {
        const category = await prisma.category.findUnique({
            where: {
                id,
            },
        });
        if (!category) return null;
        return this.toCategoryEntity(category);
    }
    async findByName(name: string): Promise<CategoryEntity | null> {
        const category = await prisma.category.findFirst({
            where: {
                name,
            },
        });
        if (!category) return null;
        return this.toCategoryEntity(category);
    }
    async findAll(): Promise<CategoryEntity[]> {
        const categories = await prisma.category.findMany();
        return categories.map((category) => this.toCategoryEntity(category));
    }
    async update(category: CategoryEntity): Promise<CategoryEntity> {
        const updatedCategory = await prisma.category.update({
            where: {
                id: category.id,
            },
            data: {
                name: category.name,
                createdBy: category.createdBy,
                updatedBy: category.updatedBy,
            },
        });
        return this.toCategoryEntity(updatedCategory);
    }
    async delete(id: string): Promise<void> {
        await prisma.category.delete({
            where: {
                id,
            },
        });
    }

    private toCategoryEntity(category: Category): CategoryEntity {
        const newCategory = new CategoryEntity(
            category.id,
            category.name,
        );
        newCategory.createdBy = category.createdBy;
        newCategory.updatedBy = category.updatedBy;

        return newCategory;
    }
}