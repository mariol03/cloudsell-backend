import { BaseUseCase } from "@shared/base.use-case";
import { UserEntity } from "@users/domain/user.entity";
import { UserRepository } from "@users/domain/user.repository";
import { UserInMemoryRepository } from "@users/infrastructure/user-inmemory.repository";
import { AuthGetMeDto } from "./dto/user-get-me.dto";
import { JwtTokenService } from "@users/infrastructure/jwt-token/jwt-token.service";
import { UserResponseDto } from "@users/domain/user.response";

export class UserGetMeUseCase extends BaseUseCase {
    private readonly userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        super();
        this.userRepository = userRepository || new UserInMemoryRepository();
    }

    async execute(token: string): Promise<UserResponseDto | null> {
        if (!token) throw new Error("Token is required");
        const valid = JwtTokenService.verifyToken(token);
        if (!valid) throw new Error("Invalid token");
        const user = await this.userRepository.findById(valid.id);
        if (!user) throw new Error("User not found");
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            token: token,
        };
    }
}
