import { BaseUseCase } from "@shared/base.use-case";
import { InvalidUserDataException } from "@users/domain/exceptions/invalid-user-data.exception";
import { UserEntity } from "@users/domain/user.entity";
import type { UserRepository } from "@users/domain/user.repository";
import { UserInMemoryRepository } from "@users/infrastructure/user-inmemory.repository";
import { UserGetByIdDto } from "./dto/user-get-by-id.dto";
import { UserNotFoundException } from "@users/domain/exceptions/user-not-found.exception";

export class UserGetByIdUseCase implements BaseUseCase {
    private readonly userRepository: UserRepository;

    constructor(userRepository?: UserRepository) {
        this.userRepository = userRepository || new UserInMemoryRepository();
    }
    
    async execute(request: UserGetByIdDto): Promise<UserEntity> {
        if (!request?.id) {
            throw new InvalidUserDataException();
        }
        const user = await this.userRepository.findById(request.id);
        if (!user) {
            throw new UserNotFoundException("Id", request.id);
        }

        // Retornamos una instancia de UserEntity con todas sus propiedades
        return user; // Asumiendo que findByEmail retorna un UserEntity
    }
}