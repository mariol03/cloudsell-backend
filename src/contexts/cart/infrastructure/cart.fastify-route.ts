import { FastifyInstance } from "fastify";
import {
    addToCartController,
    removeFromCartController,
    getCartController,
    updateCartController,
} from "./cart.fastify-controller";
import {
    authenticateMiddleware,
    authorizeRole,
} from "@users/infrastructure/auth/auth.middleware";
import { UserRole } from "@users/domain/user.entity";
import { addSchema, removeSchema, getSchema, updateSchema } from "./cart.schemas";
import { AddToCartRouteInterface, RemoveFromCartRouteInterface, GetCartRouteInterface, UpdateCartRouteInterface } from "./cart.routes-interfaces";

export const cartRoutes = async (fastify: FastifyInstance) => {
    // Buyer-only endpoints
    fastify.post<AddToCartRouteInterface>('/add', { schema: addSchema, onRequest: [authenticateMiddleware, authorizeRole([UserRole.BUYER])] }, addToCartController);
    fastify.post<RemoveFromCartRouteInterface>('/remove', { schema: removeSchema, onRequest: [authenticateMiddleware, authorizeRole([UserRole.BUYER])] }, removeFromCartController);
    fastify.get<GetCartRouteInterface>('/:userId', { schema: getSchema, onRequest: [authenticateMiddleware, authorizeRole([UserRole.BUYER])] }, getCartController);
    fastify.post<UpdateCartRouteInterface>('/update', { schema: updateSchema, onRequest: [authenticateMiddleware, authorizeRole([UserRole.BUYER])] }, updateCartController);
}
