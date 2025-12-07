import { FastifyInstance } from 'fastify';
import { addToCartController, removeFromCartController, getCartController, checkoutController } from './cart.fastify-controller';
import { authenticateMiddleware, authorizeRole } from '@users/infrastructure/auth.middleware';
import { UserRole } from '@users/domain/user.entity';

const addSchema = {
  body: {
    type: 'object',
    required: ['ownerId','itemId'],
    properties: {
      ownerId: { type: 'string' },
      itemId: { type: 'string' },
      quantity: { type: 'number' }
    }
  }
};

const removeSchema = {
  body: {
    type: 'object',
    required: ['ownerId','itemId'],
    properties: { ownerId: { type: 'string' }, itemId: { type: 'string' } }
  }
};

const checkoutSchema = {
  body: { type: 'object', required: ['ownerId'], properties: { ownerId: { type: 'string' } } }
};

const getSchema = {
  params: { type: 'object', required: ['ownerId'], properties: { ownerId: { type: 'string' } } }
};

export const cartRoutes = async (fastify: FastifyInstance) => {
  // Buyer-only endpoints
  fastify.post('/add', { schema: addSchema, onRequest: [authenticateMiddleware, authorizeRole([UserRole.BUYER])] }, addToCartController);
  fastify.post('/remove', { schema: removeSchema, onRequest: [authenticateMiddleware, authorizeRole([UserRole.BUYER])] }, removeFromCartController);
  fastify.post('/checkout', { schema: checkoutSchema, onRequest: [authenticateMiddleware, authorizeRole([UserRole.BUYER])] }, checkoutController);
  fastify.get('/:ownerId', { schema: getSchema, onRequest: [authenticateMiddleware, authorizeRole([UserRole.BUYER])] }, getCartController);
}
