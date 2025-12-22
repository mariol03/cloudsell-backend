import { UserRole } from "@users/domain/user.entity";

export interface UserUpdateDto {
    id: string;
    name?: string;
    email?: string;
    password?: string;
    image?: string;
    role?: UserRole;
    sellerLocation?: string;
    sellerDescription?: string;
    sellerResponseTime?: string;
}
