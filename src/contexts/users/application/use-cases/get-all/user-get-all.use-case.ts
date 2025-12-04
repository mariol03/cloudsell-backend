import { UserEntity } from "@users/domain/user.entity";
import type { UserRepository } from "@users/domain/user.repository";
import { UserInMemoryRepository } from "@users/infrastructure/user-inmemory.repository";
import { BaseUseCase } from "@shared/base.use-case";

export class UserGetAll implements BaseUseCase {
  private readonly userRepository: UserRepository;

  constructor(userRepository?: UserRepository) {
    this.userRepository = userRepository || new UserInMemoryRepository();
  }

  async execute(): Promise<Array<UserEntity>> {
    // Obtener todos los usuarios del repositorio
    const users = await this.userRepository.findAll();
    
    // Devolver la lista de usuarios
    return users;
  }
}