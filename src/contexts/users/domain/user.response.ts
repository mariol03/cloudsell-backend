import { UserRole } from "./user.entity";

export interface UserResponseDto {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    image: string;
    token: string;
}
