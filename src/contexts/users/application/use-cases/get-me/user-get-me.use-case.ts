import { BaseUseCase } from "@shared/base.use-case";
import { UserRepository } from "@users/domain/user.repository";
import { UserInMemoryRepository } from "@users/infrastructure/user-inmemory.repository";
import { JwtTokenService } from "@users/infrastructure/jwt-token/jwt-token.service";
import { UserEntity } from "@users/domain/user.entity";

export class UserGetMeUseCase extends BaseUseCase {
    private readonly userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        super();
        this.userRepository = userRepository || new UserInMemoryRepository();
    }

    async execute(token: string): Promise<UserEntity | null> {
        if (!token) throw new Error("Token is required");
        const valid = JwtTokenService.verifyToken(token);
        if (!valid) throw new Error("Invalid token");
        const user = await this.userRepository.findById(valid.id);
        if (!user) throw new Error("User not found");
        return user;
    }
}
