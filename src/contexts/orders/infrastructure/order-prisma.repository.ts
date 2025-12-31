import { prisma } from "@shared/infrastructure/prisma-singletons";
import { Prisma } from "@shared/infrastructure/prisma/client";
import { OrderEntity, OrderItem } from "../domain/order.entity";
import { OrderRepository } from "../domain/order.repository";
import { ItemEntity } from "../../items/domain/item.entity";
import { UserEntity, UserRole } from "../../users/domain/user.entity";

type OrderWithRelations = Prisma.OrderGetPayload<{
    include: {
        items: {
            include: {
                item: {
                    include: {
                        seller: true
                    }
                }
            }
        }
    }
}>;

export class OrderPrismaRepository implements OrderRepository {
    async save(order: OrderEntity): Promise<OrderEntity> {
        const newOrder = await prisma.order.create({
            data: {
                id: order.id,
                userId: order.userId,
                total: order.total,
                createdAt: order.createdAt,
                updatedAt: order.updatedAt,
                createdBy: order.createdBy,
                updatedBy: order.updatedBy,
                status: order.status,
                items: {
                    create: order.items.map((item) => ({
                        quantity: item.quantity,
                        price: item.price ?? item.item.price,
                        item: {
                            connect: {
                                id: item.item.id
                            }
                        }
                    }))
                }
            },
            include: {
                items: {
                    include: {
                        item: {
                            include: {
                                seller: true
                            }
                        }
                    }
                }
            }
        });
        return this.toEntity(newOrder);
    }
    async findById(id: string): Promise<OrderEntity | undefined> {
        const order = await prisma.order.findUnique({
            where: { id },
            include: {
                items: {
                    include: {
                        item: {
                            include: {
                                seller: true
                            }
                        }
                    }
                }
            }
        });

        if (!order) return undefined;
        return this.toEntity(order);
    }

    async findByUserId(userId: string): Promise<OrderEntity[]> {
        const orders = await prisma.order.findMany({
            where: { userId },
            include: {
                items: {
                    include: {
                        item: {
                            include: {
                                seller: true
                            }
                        }
                    }
                }
            }
        });
        return orders.map((order) => this.toEntity(order));
    }

    private toEntity(order: OrderWithRelations): OrderEntity {
        const items: OrderItem[] = order.items.map((orderItem) => {
            const prismaItem = orderItem.item;
            const prismaSeller = prismaItem.seller;

            const sellerEntity = new UserEntity(
                prismaSeller.name,
                prismaSeller.email,
                prismaSeller.password,
                prismaSeller.role as UserRole,
                prismaSeller.image
            );
            sellerEntity.id = prismaSeller.id;
            sellerEntity.createdAt = prismaSeller.createdAt;
            sellerEntity.updatedAt = prismaSeller.updatedAt;

            const itemEntity = new ItemEntity(
                prismaItem.name,
                prismaItem.description || "",
                prismaItem.image || "",
                prismaItem.price,
                prismaItem.stock,
                sellerEntity
            );
            itemEntity.id = prismaItem.id;
            itemEntity.createdAt = prismaItem.createdAt;
            itemEntity.updatedAt = prismaItem.updatedAt;

            return {
                item: itemEntity,
                quantity: orderItem.quantity,
                price: orderItem.price
            };
        });

        const orderEntity = new OrderEntity(
            order.userId,
            items
        );
        orderEntity.id = order.id;
        orderEntity.createdAt = order.createdAt;
        orderEntity.updatedAt = order.updatedAt;
        orderEntity.createdBy = order.createdBy;
        orderEntity.updatedBy = order.updatedBy;
        orderEntity.total = order.total;

        return orderEntity;
    }
}