import { FastifyReply, FastifyRequest } from 'fastify';
import { cartRepositorySingleton, orderRepositorySingleton, userRepositorySingleton } from '@shared/infrastructure/in-memory-singletons';
import { CreateOrderFromCartUseCase } from '@orders/application/use-cases/create-order/create-order-from-cart.use-case';
import { CreateOrderDto } from '@orders/application/use-cases/create-order/dto/create-order.dto';
import { ListOrdersUseCase } from '@orders/application/use-cases/list-orders/list-orders.use-case';
import { ListOrdersDto } from '../application/use-cases/list-orders/dto/list-orders.dto';

const createOrderUseCase = new CreateOrderFromCartUseCase(cartRepositorySingleton, orderRepositorySingleton, userRepositorySingleton);
const listOrdersUseCase = new ListOrdersUseCase(orderRepositorySingleton);

export const createOrderController = async (request: FastifyRequest<{ Body: CreateOrderDto }>, reply: FastifyReply) => {
  try {
    const order = await createOrderUseCase.execute(request.body);
    return reply.status(201).send(order);
  } catch (error) {
    if (error instanceof Error && error.message === 'CartEmpty') return reply.status(400).send({ message: 'Cart is empty' });
    return reply.status(500).send({ message: 'Internal server error' });
  }
}

export const listOrdersController = async (request: FastifyRequest<{ Params: ListOrdersDto }>, reply: FastifyReply) => {
    try {
        const orders = await listOrdersUseCase.execute(request.params);
        return reply.status(200).send(orders);
    } catch {
        return reply.status(500).send({ message: 'Internal server error' });
    }
}
