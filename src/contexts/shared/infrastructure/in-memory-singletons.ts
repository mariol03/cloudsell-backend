import { CategoryInMemoryRepository } from "@items/category/infrastructure/category.in-memory-repository";
import { ItemInMemoryRepository } from "@items/infrastructure/item-inmemory.repository";
import { UserInMemoryRepository } from "@contexts/users/infrastructure/user-inmemory.repository";

export const categoryRepositorySingleton = new CategoryInMemoryRepository();
export const itemRepositorySingleton = new ItemInMemoryRepository();
export const userRepositorySingleton = new UserInMemoryRepository();

// Wishlist repository singleton (in-memory)
import { WishlistInMemoryRepository } from '@items/wishlist/infrastructure/wishlist-inmemory.repository';
export const wishlistRepositorySingleton = new WishlistInMemoryRepository();