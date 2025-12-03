import { CategoryEntity } from "../../../../category/domain/category.entity";
import { ItemEntity } from "../../../../domain/item.entity";

export interface AddCategoryDto {
    /**
     * id de la categoría
     */
    item: ItemEntity;
    category: CategoryEntity;
}