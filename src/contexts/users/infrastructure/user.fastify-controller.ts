import { FastifyReply, FastifyRequest } from "fastify";
import { UserCreateDto } from "../application/use-cases/create/dto/user-create.dto";
import { UserCreator } from "../application/use-cases/create/user-create.use-case";
import { UserDeleteDto } from "../application/use-cases/delete/dto/user-delete.dto";
import { UserDeleteUseCase } from "../application/use-cases/delete/user-delete.use-case";
import { UserGetAll } from "../application/use-cases/get-all/user-get-all.use-case";
import { UserUpdateDto } from "../application/use-cases/update/dto/user-update.dto";
import { UserUpdateUseCase } from "../application/use-cases/update/user-update.use-case";
import { InvalidUserDataException } from "../domain/exceptions/invalid-user-data.exception";
import { UserAlreadyExistsException } from "../domain/exceptions/user-already-exists.exception";
import { UserNotFoundException } from "../domain/exceptions/user-not-found.exception";
import { userRepositorySingleton } from "@shared/infrastructure/in-memory-singletons";

const userRepository = userRepositorySingleton;
const userCreator = new UserCreator(userRepository);
const userGetAll = new UserGetAll(userRepository); 
const userDelete = new UserDeleteUseCase(userRepository);
const userUpdate = new UserUpdateUseCase(userRepository);

export const createUserController = async (
  request: FastifyRequest<{ Body: UserCreateDto }>, 
  reply: FastifyReply
) => {
  try {
    const user = await userCreator.execute(request.body);
    return reply.status(201).send({
      id: user.id,
      name: user.name,
      email: user.email
    });
  } catch (error: unknown) {
    if (error instanceof InvalidUserDataException) {
      // Devolver un error 422 si los datos del usuario son inválidos
      return reply.status(422).send({ message: error.message });
    } 
    if (error instanceof UserAlreadyExistsException) {
      // Devolver un error 422 si el usuario ya existe
      return reply.status(422).send({ message: error.message });
    } 
    return reply.status(500).send({ message: "Internal server error" });
  }
};

export const retrieveUsersController = async (
  request: FastifyRequest, 
  reply: FastifyReply
) => {
  try {
    const users = await userGetAll.execute();
    return reply.status(200).send(users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email
    })));
  } catch (error: unknown) {
    console.error("Error retrieving users:", error);
    return reply.status(500).send({ message: "Internal server error" });
  }
};

export const deleteUserController = async (
  request: FastifyRequest<{ Params: UserDeleteDto }>, 
  reply: FastifyReply
) => {
  try {
    const user = await userDelete.execute({ id: request.params.id });
    return reply.status(200).send({
      id: user.id,
      name: user.name,
      email: user.email
    });
  } catch (error: unknown) {
    if (error instanceof InvalidUserDataException) {
      return reply.status(422).send({ message: error.message });
    }
    if (error instanceof UserNotFoundException) {
      return reply.status(404).send({ message: error.message });
    }
    return reply.status(500).send({ message: "Internal server error" });
  }
};

export const updateUserController = async (
  request: FastifyRequest<{ Body: UserUpdateDto }>, 
  reply: FastifyReply
) => {
  try {
    const user = await userUpdate.execute(request.body);
    return reply.status(200).send({
      id: user.id,
      name: user.name,
      email: user.email
    });
  } catch (error: unknown) {
    if (error instanceof InvalidUserDataException) {
      return reply.status(422).send({ message: error.message });
    }
    if (error instanceof UserNotFoundException) {
      return reply.status(404).send({ message: error.message });
    }
    return reply.status(500).send({ message: "Internal server error" });
  }
};