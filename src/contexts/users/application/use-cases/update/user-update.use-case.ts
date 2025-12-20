import { InvalidUserDataException } from "@users/domain/exceptions/invalid-user-data.exception";
import { UserNotFoundException } from "@users/domain/exceptions/user-not-found.exception";
import { UserEntity } from "@users/domain/user.entity";
import type { UserRepository } from "@users/domain/user.repository";
import { UserInMemoryRepository } from "@users/infrastructure/user-inmemory.repository";
import { BaseUseCase } from "@shared/base.use-case";
import { UserUpdateDto } from "./dto/user-update.dto";

export class UserUpdateUseCase implements BaseUseCase {
    private readonly userRepository: UserRepository;

    constructor(userRepository?: UserRepository) {
        this.userRepository = userRepository || new UserInMemoryRepository();
    }

    async execute(request: UserUpdateDto): Promise<UserEntity> {
        if (!request?.id) {
            throw new InvalidUserDataException();
        }
        const user = await this.userRepository.findById(request.id);
        if (!user) {
            throw new UserNotFoundException("Id", request.id);
        }
        if (request.name) user.name = request.name;
        if (request.email) user.email = request.email;
        if (request.password) user.password = request.password;
        if (request.role) user.role = request.role;
        if (request.image) user.image = request.image;
        await this.userRepository.save(user);
        return user;
    }
}
