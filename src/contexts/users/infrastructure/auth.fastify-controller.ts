import { FastifyReply, FastifyRequest } from "fastify";
import {
    UserRegisterUseCase,
    RegisterDto,
} from "../application/use-cases/register/user-register.use-case";
import {
    UserLoginUseCase,
    LoginDto,
} from "../application/use-cases/login/user-login.use-case";
import { userRepositorySingleton } from "@shared/infrastructure/in-memory-singletons";
import { InvalidUserDataException } from "../domain/exceptions/invalid-user-data.exception";
import { EmailAlreadyRegisteredException } from "../domain/exceptions/email-already-registered.exception";
import { InvalidCredentialsException } from "../domain/exceptions/invalid-credentials.exception";
import { UserGetMeUseCase } from "../application/use-cases/get-me/auth-get-me.use-case";
import { AuthResponseDto } from "../domain/auth.entity";
import { AuthGetMeDto } from "../application/use-cases/get-me/dto/auth-get-me.dto";

const userRepository = userRepositorySingleton;
const registerUseCase = new UserRegisterUseCase(userRepository);
const loginUseCase = new UserLoginUseCase(userRepository);
const meUseCase = new UserGetMeUseCase(userRepository);

/**
 * Controlador para registrar un nuevo usuario
 */
export const registerController = async (
    request: FastifyRequest<{ Body: RegisterDto }>,
    reply: FastifyReply,
) => {
    try {
        const result: AuthResponseDto = await registerUseCase.execute(
            request.body,
        );
        return reply.status(201).send(result);
    } catch (error: unknown) {
        if (error instanceof InvalidUserDataException) {
            return reply.status(422).send({
                message: error.message,
                code: "INVALID_DATA",
            });
        }
        if (error instanceof EmailAlreadyRegisteredException) {
            return reply.status(409).send({
                message: error.message,
                code: "EMAIL_ALREADY_REGISTERED",
            });
        }
        return reply.status(500).send({
            message: "Internal server error",
            code: "INTERNAL_ERROR",
        });
    }
};

/**
 * Controlador para autenticar un usuario
 */
export const loginController = async (
    request: FastifyRequest<{ Body: LoginDto }>,
    reply: FastifyReply,
) => {
    try {
        const result: AuthResponseDto = await loginUseCase.execute(
            request.body,
        );
        return reply.status(200).send(result);
    } catch (error: unknown) {
        if (error instanceof InvalidCredentialsException) {
            return reply.status(401).send({
                message: error.message,
                code: "INVALID_CREDENTIALS",
            });
        }
        return reply.status(500).send({
            message: "Internal server error",
            code: "INTERNAL_ERROR",
        });
    }
};

/**
 * Controlador para obtener información del usuario actual
 */
export const getMeController = async (
    request: FastifyRequest,
    reply: FastifyReply,
) => {
    try {
        if (!request.headers.authorization) {
            return reply.status(401).send({
                message: "Unauthorized",
                code: "UNAUTHORIZED",
            });
        }
        const token = request.headers.authorization;
        const tokenParts = token.split(" ");
        if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
            return reply.status(401).send({
                message: "Invalid token",
                code: "INVALID_TOKEN",
            });
        }
        const result = await meUseCase.execute(tokenParts[1]);
        if (result) {
            return reply.status(200).send(result);
        }
        return reply.status(401).send({
            message: "Unauthorized",
            code: "UNAUTHORIZED",
        });
    } catch (error: unknown) {
        return reply.status(500).send({
            message: "Internal server error",
            code: "INTERNAL_ERROR",
        });
    }
};
