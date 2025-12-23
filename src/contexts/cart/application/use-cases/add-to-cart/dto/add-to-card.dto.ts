export interface AddToCartDto {
    ownerId: string;
    itemId: string;
    quantity?: number;
}