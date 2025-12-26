import { CategoryInMemoryRepository } from "@items/category/infrastructure/category.in-memory-repository";
import { ItemInMemoryRepository } from "@items/infrastructure/item-inmemory.repository";
import { UserInMemoryRepository } from "@contexts/users/infrastructure/user-inmemory.repository";
import { CartInMemoryRepository } from "@contexts/cart/infrastructure/cart-inmemory.repository";
import { OrderInMemoryRepository } from "@contexts/orders/infrastructure/order-inmemory.repository";

export const categoryRepositorySingleton = new CategoryInMemoryRepository();
export const itemRepositorySingleton = new ItemInMemoryRepository();
export const userRepositorySingleton = new UserInMemoryRepository();
export const cartRepositorySingleton = new CartInMemoryRepository();
export const orderRepositorySingleton = new OrderInMemoryRepository();
