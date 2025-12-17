import { BaseUseCase } from "@/contexts/shared/base.use-case";
import { InvalidItemDataException } from "@items/domain/exceptions/invalid-item-data.exception";
import { ItemNotFoundException } from "@items/domain/exceptions/item-not-found.exception";
import { ItemEntity } from "@items/domain/item.entity";
import type { ItemRepository } from "@items/domain/item.repository";
import { ItemInMemoryRepository } from "@items/infrastructure/item-inmemory.repository";
import { ItemUpdateDto } from "./dto/item-update.dto";
import { UserInMemoryRepository } from "@/contexts/users/infrastructure/user-inmemory.repository";
import { UserRepository } from "@/contexts/users/domain/user.repository";
import { UserNotFoundException } from "@/contexts/users/domain/exceptions/user-not-found.exception";
import { JwtTokenService } from "@/contexts/users/infrastructure/jwt-token.service";
import { UserEntity } from "@/contexts/users/domain/user.entity";

export class ItemUpdateUseCase implements BaseUseCase {
    private readonly itemRepository: ItemRepository;
    private readonly userRepository: UserRepository;

    constructor(
        itemRepository?: ItemRepository,
        userRepository?: UserRepository,
    ) {
        this.itemRepository = itemRepository || new ItemInMemoryRepository();
        this.userRepository = userRepository || new UserInMemoryRepository();
    }

    async execute(
        request: ItemUpdateDto,
        authorizationHeader: string | undefined,
    ): Promise<ItemEntity> {
        let user: UserEntity | undefined;

        if (
            !request?.name ||
            !request?.description ||
            !request?.image ||
            !request?.price
        ) {
            throw new InvalidItemDataException();
        }

        // comprobar que el usuario existe
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

        if (!request?.id) {
            throw new InvalidItemDataException();
        }
        const item = await this.itemRepository.findById(request.id);
        if (!item) {
            throw new ItemNotFoundException("Id", request.id);
        }
        if (request.name) item.name = request.name;
        if (request.description) item.description = request.description;
        if (request.price !== undefined) item.price = request.price;
        await this.itemRepository.update(item);
        return item;
    }
}
