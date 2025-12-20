import { UserRole } from "@/contexts/users/domain/user.entity";

export interface UserRegisterDto {
    name: string;
    email: string;
    password: string;
    role?: UserRole;
}
