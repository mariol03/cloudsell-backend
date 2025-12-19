import { UserEntity } from "@/contexts/users/domain/user.entity";
import { CategoryEntity } from "../category/domain/category.entity";
import { BaseEntity } from "@shared/base.entity";

export class ItemEntity extends BaseEntity {
    name: string; // Nombre del ítem
    description: string; // Descripción del ítem
    image: string; // URL de la imagen del ítem
    price: number; // Precio del ítem
    stock: number; // Stock del ítem
    category?: Array<CategoryEntity>; // Categorías asociadas al ítem
    user: UserEntity; // Usuario que creó el ítem

    constructor(
        name: string,
        description: string,
        image: string,
        price: number,
        stock: number,
        user: UserEntity,
    ) {
        super();
        this.name = name;
        this.description = description;
        this.image = image;
        this.price = price;
        this.stock = stock;
        this.user = user;
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
        this.category = this.category.filter((cat) => cat.id !== category.id);
    }
}
