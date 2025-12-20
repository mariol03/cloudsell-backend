import { FastifyRequest, FastifyReply } from "fastify";
import {
    JwtTokenService,
    JwtTokenPayload,
} from "@users/infrastructure/jwt-token/jwt-token.service";
import { UserRole } from "@users/domain/user.entity";

/**
 * Información del usuario autenticado adjunta a la request
 */
export interface AuthenticatedRequest extends FastifyRequest {
    user?: JwtTokenPayload;
}

/**
 * Middleware para verificar que existe un token JWT válido
 */
export const authenticateMiddleware = async (
    request: AuthenticatedRequest,
    reply: FastifyReply,
) => {
    try {
        const authHeader = request.headers.authorization;

        if (!authHeader) {
            return reply.status(401).send({
                message: "Token no proporcionado",
                code: "MISSING_TOKEN",
            });
        }

        // Esperamos el formato "Bearer <token>"
        const parts = authHeader.split(" ");
        if (parts.length !== 2 || parts[0] !== "Bearer") {
            return reply.status(401).send({
                message: "Formato de token inválido",
                code: "INVALID_TOKEN_FORMAT",
            });
        }

        const token = parts[1];
        const payload = JwtTokenService.verifyToken(token);

        // Adjuntamos la información del usuario a la request
        (request as AuthenticatedRequest).user = payload;
    } catch (error: unknown) {
        if (error instanceof Error && error.message === "jwt expired") {
            return reply.status(401).send({
                message: "Token expirado",
                code: "TOKEN_EXPIRED",
            });
        }
        return reply.status(401).send({
            message: "Token inválido",
            code: "INVALID_TOKEN",
        });
    }
};

/**
 * Middleware para verificar que el usuario tiene un rol específico
 */
export const authorizeRole = (allowedRoles: UserRole[]) => {
    return async (request: AuthenticatedRequest, reply: FastifyReply) => {
        if (!request.user) {
            return reply.status(401).send({
                message: "Usuario no autenticado",
                code: "NOT_AUTHENTICATED",
            });
        }

        if (!allowedRoles.includes(request.user.role)) {
            return reply.status(403).send({
                message: "Permiso denegado",
                code: "FORBIDDEN",
            });
        }
    };
};
