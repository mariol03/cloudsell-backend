import { BaseUseCase } from "@shared/base.use-case";
import { UserEntity, UserRole } from "@users/domain/user.entity";
import type { UserRepository } from "@users/domain/user.repository";
import { UserInMemoryRepository } from "@users/infrastructure/user-inmemory.repository";
import { InvalidUserDataException } from "@users/domain/exceptions/invalid-user-data.exception";
import { EmailAlreadyRegisteredException } from "@users/domain/exceptions/email-already-registered.exception";
import { PasswordHashService } from "@users/infrastructure/password-hash.service";
import { JwtTokenService } from "@users/infrastructure/jwt-token.service";

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface AuthResponseDto {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  token: string;
}

/**
 * Use case para registrar un nuevo usuario
 */
export class UserRegisterUseCase implements BaseUseCase {
  private readonly userRepository: UserRepository;

  constructor(userRepository?: UserRepository) {
    this.userRepository = userRepository || new UserInMemoryRepository();
  }

  async execute(request: RegisterDto): Promise<AuthResponseDto> {
    // Validación básica
    if (!request.name || !request.email || !request.password) {
      throw new InvalidUserDataException();
    }

    // Validar formato de email básico
    if (!this.isValidEmail(request.email)) {
      throw new InvalidUserDataException();
    }

    // Validar longitud de contraseña (mínimo 6 caracteres)
    if (request.password.length < 6) {
      throw new InvalidUserDataException();
    }

    // Verificar si el usuario ya existe
    const existing = await this.userRepository.findByEmail(request.email);
    if (existing) {
      throw new EmailAlreadyRegisteredException(request.email);
    }

    // Hash de la contraseña
    const hashedPassword = await PasswordHashService.hash(request.password);

    // Crear entidad del usuario
    const user = new UserEntity(
      request.name,
      request.email,
      hashedPassword,
      request.role || UserRole.BUYER
    );

    // Guardar usuario
    await this.userRepository.save(user);

    // Generar token JWT
    const token = JwtTokenService.generateToken(user);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token
    };
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
