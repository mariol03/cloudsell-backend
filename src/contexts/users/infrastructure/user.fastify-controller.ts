import { FastifyReply, FastifyRequest } from "fastify";
import { UserRegisterUseCase } from "../application/use-cases/register/user-register.use-case";
import { UserLoginUseCase } from "../application/use-cases/login/user-login.use-case";
import { userRepositorySingleton } from "@shared/infrastructure/in-memory-singletons";
import { InvalidUserDataException } from "../domain/exceptions/invalid-user-data.exception";
import { EmailAlreadyRegisteredException } from "../domain/exceptions/email-already-registered.exception";
import { InvalidCredentialsException } from "../domain/exceptions/invalid-credentials.exception";
import { UserGetMeUseCase } from "../application/use-cases/get-me/user-get-me.use-case";
import { UserResponseDto } from "../domain/user.response";
import { AuthGetMeDto } from "../application/use-cases/get-me/dto/user-get-me.dto";
import { UserRegisterDto } from "../application/use-cases/register/dto/user-register.dto";
import { UserLoginDto } from "../application/use-cases/login/dto/user-login.dto";
import { UserUpdateDto } from "../application/use-cases/update/dto/user-update.dto";
import { UserUpdateUseCase } from "../application/use-cases/update/user-update.use-case";

const userRepository = userRepositorySingleton;
const userRegisterUseCase = new UserRegisterUseCase(userRepository);
const userLoginUseCase = new UserLoginUseCase(userRepository);
const userGetMeUseCase = new UserGetMeUseCase(userRepository);
const userUpdateUseCase = new UserUpdateUseCase(userRepository);

/**
 * Controlador para registrar un nuevo usuario
 */
export const registerController = async (
    request: FastifyRequest<{ Body: UserRegisterDto }>,
    reply: FastifyReply,
) => {
    try {
        const result: UserResponseDto = await userRegisterUseCase.execute(
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
    request: FastifyRequest<{ Body: UserLoginDto }>,
    reply: FastifyReply,
) => {
    try {
        const result: UserResponseDto = await userLoginUseCase.execute(
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
        const result = await userGetMeUseCase.execute(tokenParts[1]);
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

export const updateUserController = async (
    request: FastifyRequest<{ Body: UserUpdateDto }>,
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
        const result = await userUpdateUseCase.execute(request.body);
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
