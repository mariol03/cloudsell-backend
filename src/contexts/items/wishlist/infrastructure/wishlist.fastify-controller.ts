import { FastifyReply, FastifyRequest } from 'fastify';
import { wishlistRepositorySingleton } from '@shared/infrastructure/in-memory-singletons';
import { itemRepositorySingleton } from '@shared/infrastructure/in-memory-singletons';
import { WishlistCreateUseCase } from '@wishlist/application/use-cases/create/wishlist-create.use-case';
import { WishlistAddItemUseCase } from '@wishlist/application/use-cases/add-item/wishlist-add-item.use-case';
import { WishlistRemoveItemUseCase } from '@wishlist/application/use-cases/remove-item/wishlist-remove-item.use-case';
import { WishlistGetUseCase } from '@wishlist/application/use-cases/get/wishlist-get.use-case';

const createUseCase = new WishlistCreateUseCase(wishlistRepositorySingleton);
const addUseCase = new WishlistAddItemUseCase(wishlistRepositorySingleton, itemRepositorySingleton);
const removeUseCase = new WishlistRemoveItemUseCase(wishlistRepositorySingleton);
const getUseCase = new WishlistGetUseCase(wishlistRepositorySingleton);

export const createWishlistController = async (request: FastifyRequest<{Body:{ownerId:string}}>, reply: FastifyReply) => {
  try {
    const { ownerId } = request.body;
    const wishlist = await createUseCase.execute(ownerId);
    return reply.status(201).send(wishlist);
  } catch (error) {
    return reply.status(500).send({ message: 'Internal server error' });
  }
}

export const addItemController = async (request: FastifyRequest<{Body:{ownerId:string,itemId:string}}>, reply: FastifyReply) => {
  try {
    const { ownerId, itemId } = request.body;
    const wishlist = await addUseCase.execute(ownerId, itemId);
    return reply.status(200).send(wishlist);
  } catch (error: any) {
    if (error.message === 'ItemNotFound') return reply.status(404).send({ message: 'Item not found' });
    return reply.status(500).send({ message: 'Internal server error' });
  }
}

export const removeItemController = async (request: FastifyRequest<{Body:{ownerId:string,itemId:string}}>, reply: FastifyReply) => {
  try {
    const { ownerId, itemId } = request.body;
    const wishlist = await removeUseCase.execute(ownerId, itemId);
    return reply.status(200).send(wishlist);
  } catch (error: any) {
    if (error.message === 'WishlistNotFound') return reply.status(404).send({ message: 'Wishlist not found' });
    return reply.status(500).send({ message: 'Internal server error' });
  }
}

export const getWishlistController = async (request: FastifyRequest<{Params:{ownerId:string}}>, reply: FastifyReply) => {
  try {
    const ownerId = (request.params as any).ownerId;
    const wishlist = await getUseCase.execute(ownerId);
    if (!wishlist) return reply.status(200).send({ items: [] });
    return reply.status(200).send(wishlist);
  } catch (error) {
    return reply.status(500).send({ message: 'Internal server error' });
  }
}
