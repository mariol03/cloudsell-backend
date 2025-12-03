import { CategoryEntity } from "../../../../category/domain/category.entity";
import { ItemEntity } from "../../../../domain/item.entity";

export interface DeleteCategoryDto {
    /**
     * item
     */
    item: ItemEntity;
    /**
     * category
     */
    category: CategoryEntity;
}