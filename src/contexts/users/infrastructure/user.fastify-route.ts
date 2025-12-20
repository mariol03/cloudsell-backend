import { FastifyInstance, FastifyPluginOptions } from "fastify";
import {
    registerController,
    loginController,
    getMeController,
} from "./user.fastify-controller";
import { getMeSchema, loginSchema, registerSchema } from "./user.schemas";

/**
 * Rutas públicas de autenticación (sin protección)
 */
export const authRoutes = async (
    fastify: FastifyInstance,
    _options: FastifyPluginOptions,
) => {
    // Registro de nuevo usuario
    fastify.put("/register", {
        schema: registerSchema,
        handler: registerController,
    });

    // Login de usuario existente
    fastify.post("/login", {
        schema: loginSchema,
        handler: loginController,
    });

    fastify.get("/me", {
        schema: getMeSchema,
        handler: getMeController,
    });
};
