import { FastifyReply, FastifyRequest } from 'fastify';
import { cartRepositorySingleton, orderRepositorySingleton, userRepositorySingleton } from '@shared/infrastructure/in-memory-singletons';
import { CreateOrderFromCartUseCase } from '@contexts/orders/application/use-cases/create-order/create-order-from-cart.use-case';
import { CreateOrderDto } from '@contexts/orders/application/use-cases/create-order/dto/create-order.dto';

const createOrderUseCase = new CreateOrderFromCartUseCase(cartRepositorySingleton, orderRepositorySingleton, userRepositorySingleton);

export const createOrderController = async (request: FastifyRequest<{ Body: CreateOrderDto }>, reply: FastifyReply) => {
  try {
    const order = await createOrderUseCase.execute(request.body);
    return reply.status(201).send(order);
  } catch (error: any) {
    if (error.message === 'CartEmpty') return reply.status(400).send({ message: 'Cart is empty' });
    return reply.status(500).send({ message: 'Internal server error' });
  }
}
