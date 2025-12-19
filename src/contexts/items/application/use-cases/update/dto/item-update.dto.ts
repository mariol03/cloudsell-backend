export interface ItemUpdateDto {
    id: string;
    name?: string;
    description?: string;
    price?: number;
    image?: string;
    stock?: number;
    user?: string;
}
