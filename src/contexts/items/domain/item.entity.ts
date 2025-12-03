import { CategoryEntity } from "../category/domain/category.entity";
import { BaseEntity } from "@shared/base.entity";

export class ItemEntity extends BaseEntity {
    /**
     * Nombre del ítem
     */
    name: string;

    /**
     * Descripción del ítem
     */
    description: string;

    /**
     * Precio del ítem (opcional)
     */
    price?: number;

    category?: Array<CategoryEntity>;

    constructor(name: string, description: string) {
        super();
        this.name = name;
        this.description = description;
    }

    addCategory(category: CategoryEntity) {
        if (!this.category) {
            this.category = [];
        }
        this.category.push(category);
    }

    deleteCategory(category: CategoryEntity) {
        if (!this.category) {
            return;
        }
        this.category = this.category.filter(cat => cat.id !== category.id);
    }
}