import { BaseUseCase } from "@shared/base.use-case";
import { ItemDeleteDto } from "./dto/item-delete.dto";
import { ItemEntity } from "@items/domain/item.entity";
import type { ItemRepository } from "@items/domain/item.repository";
import { ItemInMemoryRepository } from "@items/infrastructure/item-inmemory.repository";
import { InvalidItemDataException } from "@items/domain/exceptions/invalid-item-data.exception";
import { ItemNotFoundException } from "@items/domain/exceptions/item-not-found.exception";
import { UserEntity } from "@users/domain/user.entity";
import { UserRepository } from "@users/domain/user.repository";
import { UserInMemoryRepository } from "@users/infrastructure/user-inmemory.repository";
import { UserNotFoundException } from "@users/domain/exceptions/user-not-found.exception";
import { JwtTokenService } from "@users/infrastructure/jwt-token/jwt-token.service";
import { UserUnauthorizedException } from "@/contexts/users/domain/exceptions/user-unauthorized.exception";

export class ItemDeleteUseCase extends BaseUseCase {
    private readonly itemRepository: ItemRepository;
    private readonly userRepository: UserRepository;

    constructor(
        itemRepository?: ItemRepository,
        userRepository?: UserRepository,
    ) {
        super();
        this.itemRepository = itemRepository || new ItemInMemoryRepository();
        this.userRepository = userRepository || new UserInMemoryRepository();
    }

    async execute(
        request: ItemDeleteDto,
        authorizationHeader: string | undefined,
    ): Promise<ItemEntity | null> {
        if (!request?.id || !authorizationHeader) {
            throw new InvalidItemDataException();
        }

        let user: UserEntity | undefined = undefined;
        if (!authorizationHeader) {
            if (!request?.user) {
                throw new InvalidItemDataException();
            }
            user = await this.userRepository.findById(request.user);
            if (!user) {
                throw new UserNotFoundException(request.user, "id");
            }
        } else {
            // Delete the first part of the token ("Bearer ")
            let token = authorizationHeader.replace(/Bearer /, "");
            token = JwtTokenService.verifyToken(token).id;
            user = await this.userRepository.findById(token);
            if (!user) {
                throw new UserNotFoundException(token, "id");
            }
        }

        const item = await this.itemRepository.findById(request.id);
        if (!item) {
            throw new ItemNotFoundException("Id", request.id);
        }

        if (user && item.user.id !== user.id) {
            throw new UserUnauthorizedException(
                "User is not authorized to delete this item",
            );
        }

        await this.itemRepository.delete(item);
        return item;
    }
}
