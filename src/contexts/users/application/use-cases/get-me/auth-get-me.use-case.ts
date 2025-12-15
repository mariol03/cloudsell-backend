import { BaseUseCase } from "@/contexts/shared/base.use-case";
import { UserEntity } from "@/contexts/users/domain/user.entity";
import { UserRepository } from "@/contexts/users/domain/user.repository";
import { UserInMemoryRepository } from "@/contexts/users/infrastructure/user-inmemory.repository";
import { UserGetByIdDto } from "../get-by-id/dto/user-get-by-id.dto";
import { AuthGetMeDto } from "./dto/auth-get-me.dto";
import { JwtTokenService } from "@/contexts/users/infrastructure/jwt-token.service";
import { AuthResponseDto } from "@/contexts/users/domain/auth.entity";

export class UserGetMeUseCase extends BaseUseCase {
    private readonly userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        super();
        this.userRepository = userRepository || new UserInMemoryRepository();
    }

    async execute(token: string): Promise<AuthResponseDto | null> {
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
