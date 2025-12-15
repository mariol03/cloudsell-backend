import { UserRole } from "./user.entity";

export interface AuthResponseDto {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    token: string;
}
