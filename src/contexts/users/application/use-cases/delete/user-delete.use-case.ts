import { InvalidUserDataException } from "@users/domain/exceptions/invalid-user-data.exception";
import { UserNotFoundException } from "@users/domain/exceptions/user-not-found.exception";
import { UserEntity } from "@users/domain/user.entity";
import type { UserRepository } from "@users/domain/user.repository";
import { UserInMemoryRepository } from "@users/infrastructure/user-inmemory.repository";
import { BaseUseCase } from "@shared/base.use-case";
import { UserDeleteDto } from "./dto/user-delete.dto";


export class UserDeleteUseCase implements BaseUseCase {
  private readonly userRepository: UserRepository;

  constructor(userRepository?: UserRepository) {
    this.userRepository = userRepository || new UserInMemoryRepository();
  }

  async execute(request: UserDeleteDto): Promise<UserEntity> {
    if (!request?.id) {
      throw new InvalidUserDataException();
    }
    const user = await this.userRepository.findById(request.id);
    if (!user) {
      throw new UserNotFoundException("Id", request.id);
    }
    await this.userRepository.deleteById(request.id);
    return user;
  }
}
