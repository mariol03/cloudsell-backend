import { FastifyInstance } from 'fastify';
import { createWishlistController, addItemController, removeItemController, getWishlistController } from './wishlist.fastify-controller';
import { authenticateMiddleware, authorizeRole } from '@users/infrastructure/auth.middleware';
import { UserRole } from '@users/domain/user.entity';

const createSchema = {
  body: {
    type: 'object',
    required: ['ownerId'],
    properties: {
      ownerId: { type: 'string' }
    }
  }
};

const addRemoveSchema = {
  body: {
    type: 'object',
    required: ['ownerId','itemId'],
    properties: {
      ownerId: { type: 'string' },
      itemId: { type: 'string' }
    }
  }
};

const getSchema = {
  params: {
    type: 'object',
    required: ['ownerId'],
    properties: { ownerId: { type: 'string' } }
  }
};

export const wishlistRoutes = async (fastify: FastifyInstance) => {
  // Require authentication and BUYER role to manage wishlists
  fastify.put('/', { schema: createSchema, onRequest: [authenticateMiddleware, authorizeRole([UserRole.BUYER])] }, createWishlistController);
  fastify.post('/add-item', { schema: addRemoveSchema, onRequest: [authenticateMiddleware, authorizeRole([UserRole.BUYER])] }, addItemController);
  fastify.post('/remove-item', { schema: addRemoveSchema, onRequest: [authenticateMiddleware, authorizeRole([UserRole.BUYER])] }, removeItemController);
  fastify.get('/:ownerId', { schema: getSchema, onRequest: [authenticateMiddleware, authorizeRole([UserRole.BUYER])] }, getWishlistController);
};
