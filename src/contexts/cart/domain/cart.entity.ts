import { BaseEntity } from "@shared/base.entity";
import { ItemEntity } from "@items/domain/item.entity";

export type CartItem = {
    item: ItemEntity;
    quantity: number;
};

export class CartEntity extends BaseEntity {
    userId: string;
    items: CartItem[] = [];

    constructor(userId: string) {
        super();
        this.userId = userId;
    }

    addItem(item: ItemEntity, quantity = 1) {
        const existing = this.items.find((i) => i.item.id === item.id);
        if (existing) {
            existing.quantity += quantity;
        } else {
            this.items.push({ item, quantity });
        }
    }

    updateQuantity(itemId: string, quantity: number) {
        if (quantity <= 0) {
            this.items = this.items.filter((i) => i.item.id !== itemId);
            return;
        }
        const existing = this.items.find((i) => i.item.id === itemId);
        if (existing) existing.quantity = quantity;
    }

    removeItem(itemId: string) {
        this.items = this.items.filter((i) => i.item.id !== itemId);
    }

    clear() {
        this.items = [];
    }
}
