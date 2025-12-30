import { FastifyReply, FastifyRequest } from "fastify";
import { CategoryCreator } from "../application/use-cases/create/category-create.use-case";
import { CategoryCreateDto } from "../application/use-cases/create/dto/category-create.dto";
import { CategoryDeleteUseCase } from "../application/use-cases/delete/category-delete.use-case";
import { CategoryDeleteDto } from "../application/use-cases/delete/dto/category-delete.dto";
import { CategoryGetAllUseCase } from "../application/use-cases/get-all/category-get-all.use-case";
import { CategoryGetByIdUseCase } from "../application/use-cases/get-by-id/category-get-by-id.use-case";
import { CategoryGetByIdDto } from "../application/use-cases/get-by-id/dto/category-get-by-id.dto";
import { CategoryGetByNameUseCase } from "../application/use-cases/get-by-name/category-get-by-name.use-case";
import { CategoryGetByNameDto } from "../application/use-cases/get-by-name/dto/category-get-by-name.dto";
import { CategoryAlreadyFoundException } from "../domain/exceptions/category-already-found.exception";
import { CategoryInvalidDataException } from "../domain/exceptions/category-invalid-data.exception";
import { CategoryNotFoundException } from "../domain/exceptions/category-not-found.exception";
import { CategoryUpdateDto } from "../application/use-cases/update/dto/category-update.dto";
import { CategoryUpdateUseCase } from "../application/use-cases/update/category-update.use-case";
import { categoryRepositoryPrismaSingleton } from "@/contexts/shared/infrastructure/prisma-singletons";

const categoryRepository = categoryRepositoryPrismaSingleton;
const categoryCreator = new CategoryCreator(categoryRepository);
const categoryGetById = new CategoryGetByIdUseCase(categoryRepository);
const categoryGetByName = new CategoryGetByNameUseCase(categoryRepository);
const categoryGetAll = new CategoryGetAllUseCase(categoryRepository);
const categoryDelete = new CategoryDeleteUseCase(categoryRepository);
const categoryUpdate = new CategoryUpdateUseCase(categoryRepository);

export const createCategoryController = async (
    request: FastifyRequest<{ Body: CategoryCreateDto }>,
    reply: FastifyReply
) => {
    try {
        const category = await categoryCreator.execute(request.body);
        return reply.status(201).send({
            id: category.id,
            name: category.name,
            description: category.description
        });
    } catch (error: unknown) {
        if (error instanceof CategoryInvalidDataException) {
            return reply.status(422).send({ message: error.message });
        }
        if (error instanceof CategoryAlreadyFoundException) {
            return reply.status(422).send({ message: error.message });
        }
        return reply.status(500).send({ message: "Internal server error" });
    }
}

export const retrieveCategoryByIdController = async (
    request: FastifyRequest<{ Params: CategoryGetByIdDto }>,
    reply: FastifyReply
) => {
    try {
        const category = await categoryGetById.execute(request.params);
        if (!category) {
            return reply.status(404).send({ message: "Category not found" });
        }
        return reply.status(200).send({
            id: category.id,
            name: category.name,
            description: category.description
        });
    }
    catch (error: unknown) {
        if (error instanceof CategoryNotFoundException) {
            return reply.status(404).send({ message: error.message });
        }
        if (error instanceof CategoryInvalidDataException) {
            return reply.status(422).send({ message: error.message });
        }
        return reply.status(500).send({ message: "Internal server error" });
    }
}

export const retrieveCategoryByNameController = async (
    request: FastifyRequest<{ Params: CategoryGetByNameDto }>,
    reply: FastifyReply
) => {
    try {
        const category = await categoryGetByName.execute(request.params);
        if (!category) {
            return reply.status(404).send({ message: "Category not found" });
        }
        return reply.status(200).send({
            id: category.id,
            name: category.name,
            description: category.description
        });
    } catch (error: unknown) {
        if (error instanceof CategoryNotFoundException) {
            return reply.status(404).send({ message: error.message });
        }
        if (error instanceof CategoryInvalidDataException) {
            return reply.status(422).send({ message: error.message });
        }
        return reply.status(500).send({ message: "Internal server error" });
    }
}

export const retrieveAllCategoriesController = async (
    request: FastifyRequest,
    reply: FastifyReply
) => {
    try {
        const categories = await categoryGetAll.execute();
        return reply.status(200).send(categories.map(category => ({
            id: category.id,
            name: category.name,
            description: category.description
        })));
    } catch (error: unknown) {
        console.error("Error retrieving categories:", error);
        return reply.status(500).send({ message: "Internal server error" });
    }
};

export const deleteCategoryController = async (
    request: FastifyRequest<{ Body: CategoryDeleteDto }>,
    reply: FastifyReply
) => {
    try {
        await categoryDelete.execute(request.body);
        return reply.status(200).send();
    } catch (error: unknown) {
        if (error instanceof CategoryInvalidDataException) {
            return reply.status(422).send({ message: error.message });
        }
        if (error instanceof CategoryNotFoundException) {
            return reply.status(404).send({ message: error.message });
        }
        return reply.status(500).send({ message: "Internal server error" });
    }
};

export const updateCategoryController = async (
    request: FastifyRequest<{ Body: CategoryUpdateDto }>,
    reply: FastifyReply
) => {
    try {
        const updatedCategory = await categoryUpdate.execute(request.body);
        return reply.status(200).send({
            id: updatedCategory.id,
            name: updatedCategory.name,
            description: updatedCategory.description
        });
    } catch (error: unknown) {
        if (error instanceof CategoryInvalidDataException) {
            return reply.status(422).send({ message: error.message });
        }
        if (error instanceof CategoryNotFoundException) {
            return reply.status(404).send({ message: error.message });
        }
        return reply.status(500).send({ message: "Internal server error" });
    }
};
