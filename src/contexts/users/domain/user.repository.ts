import { UserEntity } from "./user.entity";

export interface UserRepository {
    save(user: UserEntity): Promise<UserEntity>;
    findByEmail(email: string): Promise<UserEntity | undefined>;
    findById(id: string): Promise<UserEntity | undefined>;
    deleteById(id: string): Promise<void>;
    findAll(): Promise<Array<UserEntity>>;
}
