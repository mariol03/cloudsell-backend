import { FastifyInstance } from "fastify";
import { createOrderController, listOrdersController } from "./orders.fastify-controller";
import { authenticateMiddleware, authorizeRole } from "@users/infrastructure/auth/auth.middleware";
import { UserRole } from "@users/domain/user.entity";
import { checkoutSchema } from "./orders.schemas"; 
import { CreateOrderRouteInterface, ListOrdersRouteInterface } from "./orders.routes-interfaces";


export const orderRoutes = async (fastify: FastifyInstance) => {
    fastify.post<CreateOrderRouteInterface>('/', { schema: checkoutSchema, onRequest: [authenticateMiddleware, authorizeRole([UserRole.BUYER])] }, createOrderController);
    fastify.get<ListOrdersRouteInterface>('/', { onRequest: [authenticateMiddleware, authorizeRole([UserRole.BUYER])] }, listOrdersController);
}
