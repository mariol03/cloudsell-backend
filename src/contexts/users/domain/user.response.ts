import { UserRole } from "./user.entity";
import { SellerStats } from "./seller.stats";
import { BuyerStats } from "./buyer.stats";

export interface UserResponseDto {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    image: string;
    token: string;
    sellerStats?: SellerStats;
    buyerStats?: BuyerStats;
}
