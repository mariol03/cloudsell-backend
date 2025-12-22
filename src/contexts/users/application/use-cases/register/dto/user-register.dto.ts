import { UserRole } from "@/contexts/users/domain/user.entity";

export interface UserRegisterDto {
    name: string;
    email: string;
    password: string;
    image: string;
    role?: UserRole;
    sellerLocation?: string;
    sellerDescription?: string;
    sellerResponseTime?: string;
}
