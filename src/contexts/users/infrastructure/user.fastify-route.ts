import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { 
  createUserController, 
  deleteUserController, 
  retrieveUsersController, 
  updateUserController 
} from "./user.fastify-controller";
import { authenticateMiddleware } from "./auth.middleware";

// Schemas para validación de entrada
const createUserSchema = {
  body: {
    type: 'object',
    required: ['name', 'email', 'password'],
    properties: {
      name: { type: 'string', minLength: 1 },
      email: { type: 'string', format: 'email' },
      password: { type: 'string', minLength: 6 }
    }
  },
  response: {
    201: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        email: { type: 'string' }
      }
    }
  }
};

const updateUserSchema = {
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string' }
    }
  },
  body: {
    type: 'object',
    properties: {
      name: { type: 'string', minLength: 1 },
      email: { type: 'string', format: 'email' },
      password: { type: 'string', minLength: 6 }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        email: { type: 'string' }
      }
    }
  }
};

const deleteUserSchema = {
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string' }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        email: { type: 'string' }
      }
    }
  }
};

const getUsersSchema = {
  response: {
    200: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          email: { type: 'string' }
        }
      }
    }
  }
};

export const userRoutes = async (fastify: FastifyInstance, _options: FastifyPluginOptions) => {
  // Obtener todos los usuarios (requiere autenticación)
  fastify.get("/", {
    schema: getUsersSchema,
    onRequest: [authenticateMiddleware],
    handler: retrieveUsersController
  });

  // Crear un nuevo usuario (requiere autenticación)
  fastify.put("/", {
    schema: createUserSchema,
    onRequest: [authenticateMiddleware],
    handler: createUserController
  });

  // Actualizar usuario (requiere autenticación)
  fastify.patch("/:id", {
    schema: updateUserSchema,
    onRequest: [authenticateMiddleware],
    handler: updateUserController
  });

  // Eliminar usuario (requiere autenticación)
  fastify.delete("/:id", {
    schema: deleteUserSchema,
    onRequest: [authenticateMiddleware],
    handler: deleteUserController
  });
};
