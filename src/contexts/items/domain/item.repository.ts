import { ItemEntity } from "./item.entity";

export interface ItemRepository {
    create(item: ItemEntity): Promise<ItemEntity>;
    update(item: ItemEntity): Promise<ItemEntity>;
    delete(item: ItemEntity): Promise<void>;
    findByName(name: string): Promise<ItemEntity | null>;
    findById(id: string): Promise<ItemEntity | null>;
    findByUserId(userId: string): Promise<Array<ItemEntity>>;
    findAll(): Promise<Array<ItemEntity>>;
}
