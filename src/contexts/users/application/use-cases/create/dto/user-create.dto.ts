import { UserRole } from "@users/domain/user.entity";

export interface UserCreateDto {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}
