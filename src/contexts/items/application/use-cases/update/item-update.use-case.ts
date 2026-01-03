import { BaseUseCase } from "@/contexts/shared/base.use-case";
import { InvalidItemDataException } from "@items/domain/exceptions/invalid-item-data.exception";
import { ItemNotFoundException } from "@items/domain/exceptions/item-not-found.exception";
import { ItemEntity } from "@items/domain/item.entity";
import type { ItemRepository } from "@items/domain/item.repository";
import { ItemInMemoryRepository } from "@items/infrastructure/item-inmemory.repository";
import { ItemUpdateDto } from "./dto/item-update.dto";
import { UserInMemoryRepository } from "@/contexts/users/infrastructure/user-inmemory.repository";
import { UserRepository } from "@users/domain/user.repository";
import { UserNotFoundException } from "@users/domain/exceptions/user-not-found.exception";
import { JwtTokenService } from "@users/infrastructure/jwt-token/jwt-token.service";
import { UserEntity } from "@users/domain/user.entity";
import { getLogger } from "@shared/infrastructure/logger/singleton.logger";
import { isNumberObject } from "util/types";
import { CategoryRepository } from "../../../category/domain/category.respository";
import { CategoryInMemoryRepository } from "../../../category/infrastructure/category.in-memory-repository";

const logger = getLogger();

export class ItemUpdateUseCase implements BaseUseCase {
    private readonly itemRepository: ItemRepository;
    private readonly userRepository: UserRepository;
    private readonly categoryRepository: CategoryRepository;

    constructor(
        itemRepository?: ItemRepository,
        userRepository?: UserRepository,
        categoryRepository?: CategoryRepository,
    ) {
        this.itemRepository = itemRepository || new ItemInMemoryRepository();
        this.userRepository = userRepository || new UserInMemoryRepository();
        this.categoryRepository = categoryRepository || new CategoryInMemoryRepository();
    }

    async execute(
        request: ItemUpdateDto,
        authorizationHeader: string | undefined,
    ): Promise<ItemEntity> {
        let user: UserEntity | undefined;

        if (isNumberObject(request?.price)) {
            logger.error("Invalid item data");
            throw new InvalidItemDataException();
        }

        // comprobar que el usuario existe
        if (!authorizationHeader) {
            if (!request?.user) {
                logger.error("Invalid user data");
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
            logger.error("Invalid item id");
            throw new InvalidItemDataException();
        }
        const item = await this.itemRepository.findById(request.id);
        if (!item) {
            throw new ItemNotFoundException("Id", request.id);
        }
        if (request.name) item.name = request.name;
        if (request.description) item.description = request.description;
        if (request.price !== undefined) item.price = request.price;
        if (request.stock !== undefined) item.stock = request.stock;
        if (request.image !== undefined) item.image = request.image;
        if (request.categories) {
            item.category = [];
            for (const categoryId of request.categories) {
                const category = await this.categoryRepository.findById(categoryId);
                if (category) {
                    item.addCategory(category);
                }
            }
        }
        await this.itemRepository.update(item);
        return item;
    }
}
