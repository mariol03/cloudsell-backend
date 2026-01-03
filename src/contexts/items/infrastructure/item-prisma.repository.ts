import { prisma } from "@/contexts/shared/infrastructure/prisma-singletons";
import { ItemEntity } from "../domain/item.entity";
import { ItemRepository } from "../domain/item.repository";
import { Category, Item, User } from "@/contexts/shared/infrastructure/prisma/client";
import { UserEntity, UserRole } from "@/contexts/users/domain/user.entity";
import { InvalidItemDataException } from "../domain/exceptions/invalid-item-data.exception";
import { CategoryEntity } from "../category/domain/category.entity";


type ItemWithSeller = Item & { seller: User } & { categories?: Array<Category> };

export class ItemPrismaRepository implements ItemRepository {
    async create(item: ItemEntity): Promise<ItemEntity> {
        const newItem = await prisma.item.create({
            data: {
                id: item.id,
                name: item.name,
                description: item.description,
                price: item.price,
                seller: {
                    connect: {
                        id: item.user.id
                    }
                },
                image: item.image,
                stock: item.stock,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
                createdBy: item.createdBy,
                updatedBy: item.updatedBy
            }, include: {
                seller: true
            }
        });
        const itemEntity = this.toEntity(newItem);
        if (!itemEntity) {
            throw new InvalidItemDataException();
        }
        return itemEntity;
    }
    async update(item: ItemEntity): Promise<ItemEntity> {
        const existingItem = await prisma.item.findUnique({
            where: {
                id: item.id
            },
            include: {
                categories: true
            }
        });
        if (!existingItem) {
            throw new InvalidItemDataException();
        }
        if (item.category && item.category.length > 0) {
            const newCategoryIds = item.category.map(cat => cat.id);
            const existingCategoryIds = existingItem.categories.map(cat => cat.id);
            
            const categoriesToConnect = newCategoryIds.filter(id => !existingCategoryIds.includes(id));
            const categoriesToDisconnect = existingCategoryIds.filter(id => !newCategoryIds.includes(id));

            const updatedItemCategories = await prisma.item.update({
                where: {
                    id: item.id
                },
                data: {
                    name: item.name,
                    description: item.description,
                    price: item.price,
                    image: item.image,
                    stock: item.stock,
                    updatedAt: item.updatedAt,
                    updatedBy: item.updatedBy,
                    categories: {
                        connect: categoriesToConnect.map(id => ({ id })),
                        disconnect: categoriesToDisconnect.map(id => ({ id }))
                    }
                },
                include: {
                    seller: true
                }
            });
            const itemEntity = this.toEntity(updatedItemCategories);
            if (!itemEntity) {
                throw new InvalidItemDataException();
            }
            return itemEntity;
        }
        else {
            const categoriesToRemove = existingItem.categories.map(cat => cat.id);

            const updatedItem = await prisma.item.update({
                where: {
                    id: item.id
                },
                data: {
                    name: item.name,
                    description: item.description,
                    price: item.price,
                    image: item.image,
                    stock: item.stock,
                    updatedAt: item.updatedAt,
                    updatedBy: item.updatedBy,
                    categories: {
                        disconnect: categoriesToRemove.map(id => ({ id }))
                    }
                }, include: {
                    seller: true
                }
            });
            const itemEntity = this.toEntity(updatedItem);
            if (!itemEntity) {
                throw new InvalidItemDataException();
            }
            return itemEntity;
        }
    }
    async delete(item: ItemEntity): Promise<void> {
        await prisma.item.delete({
            where: {
                id: item.id
            }
        });
    }
    async findByName(name: string): Promise<ItemEntity | null> {
        const item = await prisma.item.findFirst({
            where: {
                name: name
            }, include: {
                seller: true
            }
        });
        return this.toEntity(item);
    }
    async findById(id: string): Promise<ItemEntity | null> {
        const item = await prisma.item.findUnique({
            where: {
                id: id
            }, include: {
                seller: true,
                categories: true
            },
        });
        return this.toEntity(item);
    }
    async findByUserId(userId: string): Promise<Array<ItemEntity | null>> {
        const items = await prisma.item.findMany({
            where: {
                sellerId: userId
            }, include: {
                seller: true,
                categories: true
            }
        });
        return items.map((item) => this.toEntity(item));
    }
    async findAll(): Promise<Array<ItemEntity | null>> {
        const items = await prisma.item.findMany({
            include: {
                seller: true,
                categories: true
            }
        });
        return items.map((item) => this.toEntity(item));
    }

    private toEntity(item: ItemWithSeller | null): ItemEntity | null {
        if (!item) {
            return null;
        }
        const userEntity = new UserEntity(
            item.seller.name,
            item.seller.email,
            item.seller.password,
            item.seller.role as UserRole,
            item.seller.image
        );
        const itemEntity = new ItemEntity(
            item.name,
            item.description || "",
            item.image || "",
            item.price,
            item.stock,
            userEntity
        );
        itemEntity.id = item.id;
        itemEntity.createdAt = item.createdAt;
        itemEntity.updatedAt = item.updatedAt;
        itemEntity.createdBy = item.createdBy;
        itemEntity.updatedBy = item.updatedBy;
        if (item.categories && item.categories.length > 0) {
            item.categories.forEach((category) => {
                const newCategory = new CategoryEntity(category.name, category.description || "");
                newCategory.id = category.id;
                itemEntity.addCategory(newCategory);
            });
        }
        return itemEntity;
    }
}