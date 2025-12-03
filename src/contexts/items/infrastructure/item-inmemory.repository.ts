import { ItemRepository } from "../domain/item.repository";
import { ItemEntity } from "../domain/item.entity";

export class ItemInMemoryRepository implements ItemRepository {
    private readonly items: ItemEntity[] = [];
    
    async create(item: ItemEntity): Promise<ItemEntity> {
        this.items.push(item);
        return item;
    }
    
    async update(item: ItemEntity): Promise<ItemEntity> {
        const index = this.items.findIndex(i => i.id === item.id);
        this.items[index] = item;
        return item;
    }
    
    async delete(item: ItemEntity): Promise<void> {
        const index = this.items.findIndex(i => i.id === item.id);
        if (index !== -1) {
            this.items.splice(index, 1);
        }
    }

    async findByName(name: string): Promise<ItemEntity | null> {
        return this.items.find(i => i.name === name) || null;
    }
    
    async findById(id: string): Promise<ItemEntity | null> {
        return this.items.find(i => i.id === id) || null;
    }
    
    async findAll(): Promise<ItemEntity[]> {
        return this.items;
    }
}