import { DATABASE_URL } from "../../../config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./prisma/client";
import { UserPrismaRepository } from "@users/infrastructure/user-prisma.repository";
import { OrderPrismaRepository } from "@orders/infrastructure/order-prisma.repository";
import { ItemPrismaRepository } from "@items/infrastructure/item-prisma.repository";
import { CategoryPrismaRepository } from "@items/category/infrastructure/category-prisma.repository";
import { CartPrismaRepository } from "@cart/infrastructure/cart-prisma.repository";

export const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: DATABASE_URL })
});

export const userRepositoryPrismaSingleton = new UserPrismaRepository();
export const orderRepositoryPrismaSingleton = new OrderPrismaRepository();
export const itemRepositoryPrismaSingleton = new ItemPrismaRepository();
export const categoryRepositoryPrismaSingleton = new CategoryPrismaRepository();
export const cartRepositoryPrismaSingleton = new CartPrismaRepository();