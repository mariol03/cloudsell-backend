import { FastifyInstance } from "fastify";
import {
    createItemController,
    deleteItemController,
    getItemByIdController,
    getItemByNameController,
    getItemsController,
    updateItemController,
    addCategoryToItemController,
    deleteCategoryFromItemController,
} from "./item.fastify-controller";
import {
    authenticateMiddleware,
    authorizeRole,
} from "../../users/infrastructure/auth.middleware";
import { UserRole } from "../../users/domain/user.entity";
import {
    CreateItemRoute,
    DeleteItemRoute,
    UpdateItemRoute,
} from "./item-routes-interfaces";
import {
    addCategorySchema,
    createItemSchema,
    deleteCategorySchema,
    deleteItemSchema,
    getItemByIdSchema,
    getItemByNameSchema,
    getItemsSchema,
    updateItemSchema,
} from "./item-routes-schemas";

export const itemRoutes = async (fastify: FastifyInstance) => {
    fastify.get("/", { schema: getItemsSchema }, getItemsController);
    fastify.get(
        "/id/:id",
        { schema: getItemByIdSchema },
        getItemByIdController,
    );
    fastify.get(
        "/name/:name",
        { schema: getItemByNameSchema },
        getItemByNameController,
    );
    fastify.put<CreateItemRoute>(
        "/",
        {
            schema: createItemSchema,
            onRequest: [
                authenticateMiddleware,
                authorizeRole([UserRole.SELLER]),
            ],
        },
        createItemController,
    );
    fastify.patch<UpdateItemRoute>(
        "/",
        {
            schema: updateItemSchema,
            onRequest: [
                authenticateMiddleware,
                authorizeRole([UserRole.SELLER]),
            ],
        },
        updateItemController,
    );
    fastify.delete<DeleteItemRoute>(
        "/",
        {
            schema: deleteItemSchema,
            onRequest: [
                authenticateMiddleware,
                authorizeRole([UserRole.SELLER]),
            ],
        },
        deleteItemController,
    );
    // fastify.post(
    //     "/add-category",
    //     {
    //         schema: addCategorySchema,
    //         onRequest: [
    //             authenticateMiddleware,
    //             authorizeRole([UserRole.SELLER]),
    //         ],
    //     },
    //     addCategoryToItemController,
    // );
    // fastify.post(
    //     "/delete-category",
    //     {
    //         schema: deleteCategorySchema,
    //         onRequest: [
    //             authenticateMiddleware,
    //             authorizeRole([UserRole.SELLER]),
    //         ],
    //     },
    //     deleteCategoryFromItemController,
    // );
};
