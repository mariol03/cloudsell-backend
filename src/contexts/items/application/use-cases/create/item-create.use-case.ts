import { BaseUseCase } from "@shared/base.use-case";
import { InvalidItemDataException } from "@items/domain/exceptions/invalid-item-data.exception";
import { ItemAlreadyExistsException } from "@items/domain/exceptions/item-already-exists.exception";
import { ItemEntity } from "@items/domain/item.entity";
import type { ItemRepository } from "@items/domain/item.repository";
import { ItemInMemoryRepository } from "@items/infrastructure/item-inmemory.repository";
import { ItemCreateDto } from "./dto/item-create.dto";
import { UserRepository } from "@/contexts/users/domain/user.repository";
import { UserInMemoryRepository } from "@/contexts/users/infrastructure/user-inmemory.repository";
import { UserNotFoundException } from "@/contexts/users/domain/exceptions/user-not-found.exception";
import { UserEntity } from "@/contexts/users/domain/user.entity";
import { JwtTokenService } from "@users/infrastructure/jwt-token/jwt-token.service";
import { isNumberObject } from "util/types";
import { CategoryRepository } from "../../../category/domain/category.respository";
import { CategoryInMemoryRepository } from "../../../category/infrastructure/category.in-memory-repository";

export class ItemCreateUseCase extends BaseUseCase {
    private readonly itemRepository: ItemRepository;
    private readonly userRepository: UserRepository;
    private readonly categoryRepository: CategoryRepository;

    constructor(
        itemRepository?: ItemRepository,
        userRepository?: UserRepository,
        categoryRepository?: CategoryRepository,
    ) {
        super();
        this.itemRepository = itemRepository || new ItemInMemoryRepository();
        this.userRepository = userRepository || new UserInMemoryRepository();
        this.categoryRepository = categoryRepository || new CategoryInMemoryRepository();
    }

    async execute(
        request: ItemCreateDto,
        authorizationHeader: string | undefined,
    ): Promise<ItemEntity> {
        let user: UserEntity | undefined;
        if (
            !request?.name ||
            !request?.description ||
            !request?.image ||
            isNumberObject(request?.price)
        ) {
            throw new InvalidItemDataException();
        }

        const existingItem = await this.itemRepository.findByName(request.name);
        if (existingItem) {
            throw new ItemAlreadyExistsException("name", request.name);
        }

        if (!authorizationHeader) {
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

        const newItem = new ItemEntity(
            request.name,
            request.description,
            request.image,
            request.price,
            request.stock,
            user,
        );
        if (request.categories && request.categories.length > 0) {
            for (const categoryId of request.categories) {
                const category = await this.categoryRepository.findById(categoryId);
                if (category) {
                    newItem.addCategory(category);
                }
            }
        }
        await this.itemRepository.create(newItem);
        return newItem;
    }
}
