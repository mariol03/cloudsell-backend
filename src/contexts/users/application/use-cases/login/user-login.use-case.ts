import { BaseUseCase } from "@shared/base.use-case";
// import { UserEntity, UserRole } from "@users/domain/user.entity";
import type { UserRepository } from "@users/domain/user.repository";
import { UserInMemoryRepository } from "@users/infrastructure/user-inmemory.repository";
import { InvalidCredentialsException } from "@users/domain/exceptions/invalid-credentials.exception";
import { PasswordHashService } from "@users/infrastructure/password-hash.service";
import { JwtTokenService } from "@users/infrastructure/jwt-token/jwt-token.service";
import { UserResponseDto } from "@users/domain/user.response";
import { UserLoginDto } from "./dto/user-login.dto";

/**
 * Use case para autenticar un usuario existente
 */
export class UserLoginUseCase implements BaseUseCase {
    private readonly userRepository: UserRepository;

    constructor(userRepository?: UserRepository) {
        this.userRepository = userRepository || new UserInMemoryRepository();
    }

    async execute(request: UserLoginDto): Promise<UserResponseDto> {
        // Validación básica
        if (!request.email || !request.password) {
            throw new InvalidCredentialsException();
        }

        // Buscar usuario por email
        const user = await this.userRepository.findByEmail(request.email);
        if (!user) {
            throw new InvalidCredentialsException();
        }

        // Comparar contraseña
        const isPasswordValid = await PasswordHashService.compare(
            request.password,
            user.password,
        );

        if (!isPasswordValid) {
            throw new InvalidCredentialsException();
        }

        // Generar token JWT
        const token = JwtTokenService.generateToken(user);

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            image: user.image || "",
            token,
            sellerStats: user.sellerStats || undefined,
            buyerStats: user.buyerStats || undefined,
        };
    }
}
