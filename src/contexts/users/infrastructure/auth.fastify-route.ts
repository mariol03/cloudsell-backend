import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { registerController, loginController } from "./auth.fastify-controller";
import { RegisterDto } from "../application/use-cases/register/user-register.use-case";
import { LoginDto } from "../application/use-cases/login/user-login.use-case";

// Esquema para registro
const registerSchema = {
  body: {
    type: 'object',
    required: ['name', 'email', 'password'],
    properties: {
      name: { type: 'string', minLength: 1 },
      email: { type: 'string', format: 'email' },
      password: { type: 'string', minLength: 6 },
      role: { type: 'string', enum: ['buyer', 'seller'] }
    }
  },
  response: {
    201: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        email: { type: 'string' },
        role: { type: 'string' },
        token: { type: 'string' }
      }
    }
  }
};

// Esquema para login
const loginSchema = {
  body: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: { type: 'string', format: 'email' },
      password: { type: 'string', minLength: 1 }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        email: { type: 'string' },
        role: { type: 'string' },
        token: { type: 'string' }
      }
    }
  }
};

/**
 * Rutas públicas de autenticación (sin protección)
 */
export const authRoutes = async (fastify: FastifyInstance, _options: FastifyPluginOptions) => {
  // Registro de nuevo usuario
  fastify.put("/register", {
    schema: registerSchema,
    handler: registerController
  });

  // Login de usuario existente
  fastify.post("/login", {
    schema: loginSchema,
    handler: loginController
  });
};
