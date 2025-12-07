import { FastifyReply, FastifyRequest } from 'fastify';
import { cartRepositorySingleton, itemRepositorySingleton, orderRepositorySingleton } from '@shared/infrastructure/in-memory-singletons';
import { AddToCartUseCase } from '@contexts/cart/application/use-cases/add-to-cart.use-case';
import { RemoveFromCartUseCase } from '@contexts/cart/application/use-cases/remove-from-cart.use-case';
import { CreateOrderFromCartUseCase } from '@contexts/cart/application/use-cases/create-order-from-cart.use-case';

const addUseCase = new AddToCartUseCase(cartRepositorySingleton, itemRepositorySingleton);
const removeUseCase = new RemoveFromCartUseCase(cartRepositorySingleton);
const createOrderUseCase = new CreateOrderFromCartUseCase(cartRepositorySingleton, orderRepositorySingleton);

export const addToCartController = async (request: FastifyRequest<{Body:{ownerId:string,itemId:string,quantity?:number}}>, reply: FastifyReply) => {
  try {
    const { ownerId, itemId, quantity } = request.body;
    const cart = await addUseCase.execute(ownerId, itemId, quantity ?? 1);
    return reply.status(200).send(cart);
  } catch (error: any) {
    if (error.message === 'ItemNotFound') return reply.status(404).send({ message: 'Item not found' });
    return reply.status(500).send({ message: 'Internal server error' });
  }
}

export const removeFromCartController = async (request: FastifyRequest<{Body:{ownerId:string,itemId:string}}>, reply: FastifyReply) => {
  try {
    const { ownerId, itemId } = request.body;
    const cart = await removeUseCase.execute(ownerId, itemId);
    return reply.status(200).send(cart);
  } catch (error: any) {
    if (error.message === 'CartNotFound') return reply.status(404).send({ message: 'Cart not found' });
    return reply.status(500).send({ message: 'Internal server error' });
  }
}

export const checkoutController = async (request: FastifyRequest<{Body:{ownerId:string}}>, reply: FastifyReply) => {
  try {
    const { ownerId } = request.body;
    const order = await createOrderUseCase.execute(ownerId);
    return reply.status(201).send(order);
  } catch (error: any) {
    if (error.message === 'CartEmpty') return reply.status(400).send({ message: 'Cart is empty' });
    return reply.status(500).send({ message: 'Internal server error' });
  }
}

export const getCartController = async (request: FastifyRequest<{Params:{ownerId:string}}>, reply: FastifyReply) => {
  try {
    const ownerId = (request.params as any).ownerId;
    const cart = await cartRepositorySingleton.findByOwnerId(ownerId);
    return reply.status(200).send(cart ?? { ownerId, items: [] });
  } catch (error) {
    return reply.status(500).send({ message: 'Internal server error' });
  }
}
