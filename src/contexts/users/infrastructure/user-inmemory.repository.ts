import { UserEntity } from "../domain/user.entity";
import { UserRepository } from "../domain/user.repository";

export class UserInMemoryRepository implements UserRepository {
    private readonly users: UserEntity[] = [];
    
    async save(user: UserEntity): Promise<UserEntity> {
        this.users.push(user);
        return user;
    }
    
    // Busca un usuario por su ID en la lista en memoria
    async findById(id: string): Promise<UserEntity | undefined> {
        return this.users.find(u => u.id === id);
    }
    async deleteById(id: string): Promise<void> {
        const idx = this.users.findIndex(u => u.id === id);
        if (idx !== -1) {
            this.users.splice(idx, 1);
        }
    }

    async findByEmail(email: string): Promise<UserEntity | undefined> {
        return this.users.find(u => u.email === email);
    }
    
    async findAll(): Promise<Array<UserEntity>> {
        return this.users; // Return the in-memory user list
    }
  // Otros métodos según sea necesario
}
