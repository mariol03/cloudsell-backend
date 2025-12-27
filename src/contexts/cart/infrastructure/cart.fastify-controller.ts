import { FastifyReply, FastifyRequest } from 'fastify';
import { cartRepositorySingleton, itemRepositorySingleton } from '@shared/infrastructure/in-memory-singletons';
import { AddToCartUseCase } from '@/contexts/cart/application/use-cases/add-to-cart/add-to-cart.use-case';
import { RemoveFromCartUseCase } from '@/contexts/cart/application/use-cases/remove-from-cart/remove-from-cart.use-case';
import { AddToCartDto } from '../application/use-cases/add-to-cart/dto/add-to-card.dto';
import { RemoveFromCartDto } from '../application/use-cases/remove-from-cart/dto/remote-from-cart.dto';
import { ListCartDto } from '../application/use-cases/list-cart/dto/list-cart.dto';
import { ListCartUseCase } from '../application/use-cases/list-cart/list-cart.use-case';
import { getLogger } from '@/contexts/shared/infrastructure/logger/singleton.logger';

const addUseCase = new AddToCartUseCase(cartRepositorySingleton, itemRepositorySingleton);
const removeUseCase = new RemoveFromCartUseCase(cartRepositorySingleton);
const listCartUseCase = new ListCartUseCase(cartRepositorySingleton);

export const addToCartController = async (request: FastifyRequest<{ Body: AddToCartDto }>, reply: FastifyReply) => {
  try {
    const cart = await addUseCase.execute(request.body);
    return reply.status(200).send(cart);
  } catch (error) {
    if (error instanceof Error && error.message === 'ItemNotFound') return reply.status(404).send({ message: 'Item not found' });
    return reply.status(500).send({ message: 'Internal server error' });
  }
}

export const removeFromCartController = async (request: FastifyRequest<{ Body: RemoveFromCartDto }>, reply: FastifyReply) => {
  try {
    const cart = await removeUseCase.execute(request.body);
    return reply.status(200).send(cart);
  } catch (error) {
    if (error instanceof Error && error.message === 'CartNotFound') return reply.status(404).send({ message: 'Cart not found' });
    return reply.status(500).send({ message: 'Internal server error' });
  }
}


export const getCartController = async (request: FastifyRequest<{ Params: ListCartDto }>, reply: FastifyReply) => {
  try {
    const cart = await listCartUseCase.execute(request.params);
    return reply.status(200).send(cart);
  } catch {
    return reply.status(500).send({ message: 'Internal server error' });
  }
}
