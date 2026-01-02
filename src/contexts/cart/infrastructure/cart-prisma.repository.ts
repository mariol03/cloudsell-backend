import {
    Cart,
    CartItem,
    Item,
    User,
} from "@/contexts/shared/infrastructure/prisma/client";
import { CartEntity } from "../domain/cart.entity";
import { CartRepository } from "../domain/cart.repository";
import { prisma } from "../../shared/infrastructure/prisma-singletons";
import { ItemEntity } from "../../items/domain/item.entity";
import { UserEntity, UserRole } from "../../users/domain/user.entity";

type CartWithRelations = Cart & {
    items: (CartItem & {
        item: Item & {
            seller: User;
        };
    })[];
};

export class CartPrismaRepository implements CartRepository {
    async save(cart: CartEntity): Promise<CartEntity> {
        // Obtener el carrito existente
        const oldCart = await prisma.cart.findMany({
            where: { userId: cart.userId },
            select: {
                id: true,
                userId: true,
                items: {
                    select: {
                        id: true,
                    },
                },
            },
        });

        // si existe un carrito existente, eliminar los viejos items y insertar los nuevos
        if (oldCart) {
            for (const cart of oldCart) {
                await prisma.cartItem.deleteMany({
                    where: { cartId: cart.id },
                });
                await prisma.cart.delete({ where: { id: cart.id } });
            }
        }

        // crear el nuevo carrito
        const newCart = await prisma.cart.create({
            data: {
                userId: cart.userId,
                createdBy: cart.userId,
                updatedBy: cart.userId,
                items: {
                    create: cart.items.map((i) => ({
                        itemId: i.item.id,
                        quantity: i.quantity,
                    })),
                },
            },
            include: {
                items: {
                    include: {
                        item: {
                            include: {
                                seller: true,
                            },
                        },
                    },
                },
            },
        });

        // devolver el nuevo carrito creado
        return this.toCartEntity(newCart);
    }
    async findByUserId(userId: string): Promise<CartEntity | undefined> {
        const cart = await prisma.cart.findFirst({
            where: {
                userId,
            },
            include: {
                items: {
                    include: {
                        item: {
                            include: {
                                seller: true,
                            },
                        },
                    },
                },
            },
        });
        if (!cart) return undefined;
        return this.toCartEntity(cart);
    }
    async deleteById(id: string): Promise<void> {
        await prisma.cart.delete({
            where: {
                id,
            },
        });
    }

    private toCartEntity(cart: CartWithRelations): CartEntity {
        const cartEntity = new CartEntity(cart.userId);
        cartEntity.id = cart.id;
        cartEntity.items = cart.items.map((i) => {
            const sellerUserRole =
                i.item.seller.role === "seller"
                    ? UserRole.SELLER
                    : UserRole.BUYER;
            const seller = new UserEntity(
                i.item.seller.name,
                i.item.seller.email,
                i.item.seller.password,
                sellerUserRole,
                i.item.seller.image,
            );
            seller.id = i.item.seller.id;

            const itemEntity = new ItemEntity(
                i.item.name,
                i.item.description || "",
                i.item.image || "",
                i.item.price,
                i.item.stock,
                seller,
            );
            itemEntity.id = i.item.id;

            return {
                item: itemEntity,
                quantity: i.quantity,
            };
        });
        cartEntity.createdAt = cart.createdAt;
        cartEntity.updatedAt = cart.updatedAt;
        return cartEntity;
    }
}
