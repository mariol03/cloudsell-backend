// import { ItemRepository } from "../domain/item.repository";
import {
    categoryRepositorySingleton,
} from "@shared/infrastructure/in-memory-singletons";
import { ItemCreateUseCase } from "../application/use-cases/create/item-create.use-case";
import { ItemDeleteUseCase } from "../application/use-cases/delete/item-delete.use-case";
import { ItemGetAllCase } from "../application/use-cases/get-all/item-get-all.use-case";
import { ItemGetByIdCase } from "../application/use-cases/get-by-id/item-get-by-id.use-case";
import { ItemGetByNameCase } from "../application/use-cases/get-by-name/item-get-by-name.use-case";
import { ItemUpdateUseCase } from "../application/use-cases/update/item-update.use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { ItemCreateDto } from "../application/use-cases/create/dto/item-create.dto";
import { ItemAlreadyExistsException } from "../domain/exceptions/item-already-exists.exception";
import { InvalidItemDataException } from "../domain/exceptions/invalid-item-data.exception";
import { ItemDeleteDto } from "../application/use-cases/delete/dto/item-delete.dto";
import { ItemNotFoundException } from "../domain/exceptions/item-not-found.exception";
import { ItemGetByNameDto } from "../application/use-cases/get-by-name/dto/item-get-by-name.dto";
import { ItemGetByIdDto } from "../application/use-cases/get-by-id/dto/item-get-by-id.dto";
import { ItemUpdateDto } from "../application/use-cases/update/dto/item-update.dto";
import { CategoryNotFoundException } from "@items/category/domain/exceptions/category-not-found.exception";
import { AddCategoryDto } from "../application/use-cases/add-category/dto/add-category.dto";
import { DeleteCategoryDto } from "../application/use-cases/delete-category/dto/delete-category.dto";
import { DeleteCategoryUseCase } from "../application/use-cases/delete-category/delete-category.use-case";
import { AddCategoryToItemUseCase } from "../application/use-cases/add-category/add-category.use-case";
import { CategoryRepository } from "@items/category/domain/category.respository";
import { ItemRepository } from "@items/domain/item.repository";
import { UserNotFoundException } from "@/contexts/users/domain/exceptions/user-not-found.exception";
import { UserRepository } from "@/contexts/users/domain/user.repository";
import { UserUnauthorizedException } from "@/contexts/users/domain/exceptions/user-unauthorized.exception";
import { ItemGetByUserIdUseCase } from "../application/use-cases/get-by-userid/item-get-by-userid.use-case";
import { ItemGetByUserIdDto } from "../application/use-cases/get-by-userid/dto/item-get-by-userid.dto";
import { userRepositoryPrismaSingleton } from "@/contexts/shared/infrastructure/prisma-singletons";
import { itemRepositoryPrismaSingleton } from "@/contexts/shared/infrastructure/prisma-singletons";

const itemRepository: ItemRepository = itemRepositoryPrismaSingleton;
const userRepository: UserRepository = userRepositoryPrismaSingleton;
const categoryRepository: CategoryRepository = categoryRepositorySingleton;

const itemCreate = new ItemCreateUseCase(
    itemRepository,
    userRepository,
    categoryRepository,
);
const itemDelete = new ItemDeleteUseCase(itemRepository, userRepository);
const itemGetAll = new ItemGetAllCase(itemRepository);
const itemGetById = new ItemGetByIdCase(itemRepository);
const itemGetByUserId = new ItemGetByUserIdUseCase(itemRepository);
const itemGetByName = new ItemGetByNameCase(itemRepository);
const itemUpdate = new ItemUpdateUseCase(
    itemRepository,
    userRepository,
    categoryRepository,
);
const itemAddCategory = new AddCategoryToItemUseCase(
    itemRepository,
    categoryRepository,
);
const itemDeleteCategory = new DeleteCategoryUseCase(
    itemRepository,
    categoryRepository,
);

export const createItemController = async (
    request: FastifyRequest<{ Body: ItemCreateDto }>,
    reply: FastifyReply,
) => {
    try {
        const item = await itemCreate.execute(
            request.body,
            request.headers?.authorization,
        );
        return reply.status(201).send({
            id: item.id,
            name: item.name,
            description: item.description,
        });
    } catch (error: unknown) {
        if (error instanceof ItemAlreadyExistsException) {
            return reply.status(422).send({ message: error.message });
        }
        if (error instanceof InvalidItemDataException) {
            return reply.status(422).send({ message: error.message });
        }
        if (error instanceof UserNotFoundException) {
            return reply.status(401).send({ message: error.message });
        }
        if (error instanceof UserUnauthorizedException) {
            return reply.status(401).send({ message: error.message });
        }
        return reply.status(500).send({ message: "Internal server error" });
    }
};

export const deleteItemController = async (
    request: FastifyRequest<{ Body: ItemDeleteDto }>,
    reply: FastifyReply,
) => {
    try {
        const item = await itemDelete.execute(
            request.body,
            request.headers?.authorization,
        );
        return reply.status(200).send(item);
    } catch (error) {
        if (error instanceof InvalidItemDataException) {
            return reply.status(422).send(error.message);
        }
        if (error instanceof ItemNotFoundException) {
            return reply.status(422).send(error.message);
        }
        if (error instanceof UserUnauthorizedException) {
            return reply.status(401).send({ message: error.message });
        }
        if (error instanceof UserNotFoundException) {
            return reply.status(401).send({ message: error.message });
        }
        return reply.status(500).send({ message: "Internal server error" });
    }
};

export const getItemByIdController = async (
    request: FastifyRequest<{ Params: ItemGetByIdDto }>,
    reply: FastifyReply,
) => {
    try {
        const item = await itemGetById.execute(request.params);
        return item;
    } catch (error) {
        if (error instanceof ItemNotFoundException) {
            return reply.status(404).send(error.message);
        }
        if (error instanceof InvalidItemDataException) {
            return reply.status(422).send({ message: error.message });
        }
        return reply.status(500).send({ message: "Internal server error" });
    }
};

export const getItemByNameController = async (
    request: FastifyRequest<{ Params: ItemGetByNameDto }>,
    reply: FastifyReply,
) => {
    try {
        const item = await itemGetByName.execute(request.params);
        return item;
    } catch (error) {
        if (error instanceof InvalidItemDataException) {
            return reply.status(422).send(error.message);
        }
        if (error instanceof ItemNotFoundException) {
            return reply.status(422).send(error.message);
        }
        return reply.status(500).send({ message: "Internal server error" });
    }
};

export const getItemsByUserIdController = async (
    request: FastifyRequest<{ Params: ItemGetByUserIdDto }>,
    reply: FastifyReply,
) => {
    try {
        const item = await itemGetByUserId.execute(request.params);
        return item;
    } catch (error) {
        if (error instanceof InvalidItemDataException) {
            return reply.status(422).send(error.message);
        }
        return reply.status(500).send({ message: "Internal server error" });
    }
};

export const getItemsController = async (
    request: FastifyRequest,
    reply: FastifyReply,
) => {
    try {
        const q = (request.query as any) || {};
        const filters = {
            categoryId: q.categoryId as string | undefined,
            minPrice: q.minPrice !== undefined ? Number(q.minPrice) : undefined,
            maxPrice: q.maxPrice !== undefined ? Number(q.maxPrice) : undefined,
            page: q.page !== undefined ? Number(q.page) : undefined,
            pageSize: q.pageSize !== undefined ? Number(q.pageSize) : undefined,
        };
        const items = await itemGetAll.execute(filters);
        return reply.status(200).send(items);
    } catch (error: unknown) {
        console.error("Error retrieving items:", error);
        return reply.status(500).send({ message: "Internal server error" });
    }
};

export const updateItemController = async (
    request: FastifyRequest<{ Body: ItemUpdateDto }>,
    reply: FastifyReply,
) => {
    try {
        const item = await itemUpdate.execute(
            request.body,
            request.headers?.authorization,
        );
        return reply.status(200).send(item);
    } catch (error) {
        if (error instanceof InvalidItemDataException) {
            return reply.status(422).send({ message: error.message });
        }
        if (error instanceof ItemNotFoundException) {
            return reply.status(422).send({ message: error.message });
        }
        return reply.status(500).send({ message: "Internal server error" });
    }
};

export const addCategoryToItemController = async (
    request: FastifyRequest<{ Body: AddCategoryDto }>,
    reply: FastifyReply,
) => {
    try {
        const updatedItem = await itemAddCategory.execute(request.body);
        return reply.status(200).send(updatedItem);
    } catch (error: unknown) {
        if (error instanceof ItemNotFoundException) {
            return reply.status(404).send({ message: error.message });
        }
        if (error instanceof CategoryNotFoundException) {
            return reply.status(404).send({ message: error.message });
        }
        if (error instanceof InvalidItemDataException) {
            return reply.status(422).send({ message: error.message });
        }
        return reply.status(500).send({ message: "Internal server error" });
    }
};

export const deleteCategoryFromItemController = async (
    request: FastifyRequest<{ Body: DeleteCategoryDto }>,
    reply: FastifyReply,
) => {
    try {
        const updatedItem = await itemDeleteCategory.execute(request.body);
        return reply.status(200).send(updatedItem);
    } catch (error: unknown) {
        if (error instanceof ItemNotFoundException) {
            return reply.status(404).send({ message: error.message });
        }
        if (error instanceof CategoryNotFoundException) {
            return reply.status(404).send({ message: error.message });
        }
        if (error instanceof InvalidItemDataException) {
            return reply.status(422).send({ message: error.message });
        }
        return reply.status(500).send({ message: "Internal server error" });
    }
};
