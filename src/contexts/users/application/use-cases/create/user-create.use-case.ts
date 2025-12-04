import { BaseUseCase } from "@shared/base.use-case";
import { UserEntity, UserRole } from "@users/domain/user.entity";
import { UserInMemoryRepository } from "@users/infrastructure/user-inmemory.repository";
import type { UserRepository } from "@users/domain/user.repository";
import { UserAlreadyExistsException } from "@users/domain/exceptions/user-already-exists.exception";
import { InvalidUserDataException } from "@users/domain/exceptions/invalid-user-data.exception";
import { UserCreateDto } from "./dto/user-create.dto";
import { PasswordHashService } from "@users/infrastructure/password-hash.service";

export class UserCreator implements BaseUseCase {
  private readonly userRepository: UserRepository;

  constructor(userRepository?: UserRepository) {
    this.userRepository = userRepository || new UserInMemoryRepository();
  }

  async execute(request: UserCreateDto): Promise<UserEntity> {
    // Validación básica
    if (!request.name || !request.email || !request.password) {
      throw new InvalidUserDataException();
    }

    // Verificar si el usuario ya existe
    const existing = await this.userRepository.findByEmail(request.email);
    if (existing) {
      throw new UserAlreadyExistsException("name",request.email);
    }

    // Hash de la contraseña
    const hashedPassword = await PasswordHashService.hash(request.password);

    // Crear entidad y guardar
    const user = new UserEntity(
      request.name,
      request.email,
      hashedPassword,
      request.role || UserRole.BUYER
    );
    await this.userRepository.save(user);
    return user;
  }
}
