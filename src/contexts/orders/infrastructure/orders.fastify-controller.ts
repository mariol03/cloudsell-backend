import { FastifyReply, FastifyRequest } from 'fastify';
import { cartRepositorySingleton, orderRepositorySingleton } from '@shared/infrastructure/in-memory-singletons';
import { CreateOrderFromCartUseCase } from '@orders/application/use-cases/create-order/create-order-from-cart.use-case';
import { CreateOrderDto } from '@orders/application/use-cases/create-order/dto/create-order.dto';
import { ListOrdersUseCase } from '@orders/application/use-cases/list-orders/list-orders.use-case';
import { AuthenticatedRequest } from "@users/infrastructure/auth/auth.middleware";
import { userRepositoryPrismaSingleton, orderRepositoryPrismaSingleton } from '@/contexts/shared/infrastructure/prisma-singletons';

const orderRepository = orderRepositoryPrismaSingleton;
const cartRepository = cartRepositorySingleton;
const userRepository = userRepositoryPrismaSingleton;

const createOrderUseCase = new CreateOrderFromCartUseCase(cartRepository, orderRepository, userRepository);
const listOrdersUseCase = new ListOrdersUseCase(orderRepository);


export const createOrderController = async (request: FastifyRequest<{ Body: CreateOrderDto }>, reply: FastifyReply) => {
  try {
    const order = await createOrderUseCase.execute(request.body);
    return reply.status(201).send(order);
  } catch (error) {
    if (error instanceof Error && error.message === 'CartEmpty') return reply.status(400).send({ message: 'Cart is empty' });
    return reply.status(500).send({ message: 'Internal server error' });
  }
}

export const listOrdersController = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const user = (request as AuthenticatedRequest).user;
    if (!user) throw new Error("User not authenticated");

    const orders = await listOrdersUseCase.execute(user.id);
    return reply.status(200).send(orders);
  } catch {
    return reply.status(500).send({ message: 'Internal server error' });
  }
}
