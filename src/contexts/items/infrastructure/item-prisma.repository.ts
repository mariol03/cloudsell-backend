import { prisma } from "@/contexts/shared/infrastructure/prisma-singletons";
import { ItemEntity } from "../domain/item.entity";
import { ItemRepository } from "../domain/item.repository";
import { Item, User } from "@/contexts/shared/infrastructure/prisma/client";
import { UserEntity, UserRole } from "@/contexts/users/domain/user.entity";

type ItemWithSeller = Item & { seller: User };

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
        return this.toEntity(newItem);
    }
    async update(item: ItemEntity): Promise<ItemEntity> {
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
                updatedBy: item.updatedBy
            }, include: {
                seller: true
            }
        });
        return this.toEntity(updatedItem);
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
                seller: true
            }
        });
        return this.toEntity(item);
    }
    async findByUserId(userId: string): Promise<Array<ItemEntity | null>> {
        const items = await prisma.item.findMany({
            where: {
                sellerId: userId
            }, include: {
                seller: true
            }
        });
        return items.map((item) => this.toEntity(item));
    }
    async findAll(): Promise<Array<ItemEntity | null>> {
        const items = await prisma.item.findMany({
            include: {
                seller: true
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
        return itemEntity;
    }
}