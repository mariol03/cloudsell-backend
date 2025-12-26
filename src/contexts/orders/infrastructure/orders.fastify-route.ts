import { FastifyInstance } from "fastify";
import { createOrderController } from "./orders.fastify-controller";
import { authenticateMiddleware, authorizeRole } from "@users/infrastructure/auth/auth.middleware";
import { UserRole } from "@users/domain/user.entity";
import { checkoutSchema } from "@contexts/cart/infrastructure/cart.schemas"; // Reusing schema for now, or should move it?
// Let's reuse schema for now as it defines the body structure which is shared (create order from cart)

// Define interface for route
interface CreateOrderRouteInterface {
    Body: {
        ownerId: string;
    };
}

export const orderRoutes = async (fastify: FastifyInstance) => {
    fastify.post<CreateOrderRouteInterface>('/', { schema: checkoutSchema, onRequest: [authenticateMiddleware, authorizeRole([UserRole.BUYER])] }, createOrderController);
}
