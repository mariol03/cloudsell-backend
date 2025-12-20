import { UserRole } from "./user.entity";

export interface UserResponseDto {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    token: string;
}
