import { FastifyInstance } from "fastify";
import {
    registerController,
    loginController,
    getMeController,
    updateUserController,
} from "./user.fastify-controller";
import {
    getMeSchema,
    loginSchema,
    registerSchema,
    userUpdateSchema,
} from "./user.schemas";

/**
 * Rutas públicas de autenticación (sin protección)
 */
export const userRoutes = async (
    fastify: FastifyInstance,
) => {
    // Registro de nuevo usuario
    fastify.put("/register", {
        schema: registerSchema,
        handler: registerController,
    });

    // Actualización de perfil de usuario
    fastify.put("/update", {
        schema: userUpdateSchema,
        handler: updateUserController,
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
