import { prisma } from "@shared/infrastructure/prisma-singletons";
import { UserEntity, UserRole } from "../domain/user.entity";
import { UserRepository } from "../domain/user.repository";
import { User } from "../../shared/infrastructure/prisma/client";

export class UserPrismaRepository implements UserRepository {
    async save(user: UserEntity): Promise<UserEntity> {
        const newUser = await prisma.user.create({
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                password: user.password,
                role: user.role,
                image: user.image,
                createdBy: user.createdBy,
                updatedBy: user.updatedBy,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            },
        });
        return this.toEntity(newUser);
    }

    async findByEmail(email: string): Promise<UserEntity | undefined> {
        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        });
        if (!user) {
            return undefined;
        }
        return this.toEntity(user);
    }
    async findById(id: string): Promise<UserEntity | undefined> {
        const user = await prisma.user.findUnique({
            where: {
                id: id
            }
        });
        if (!user) {
            return undefined;
        }
        return this.toEntity(user);
    }
    async deleteById(id: string): Promise<void> {
        await prisma.user.delete({
            where: {
                id: id
            }
        });
    }
    async findAll(): Promise<Array<UserEntity>> {
        const users = await prisma.user.findMany();
        return users.map((user) => this.toEntity(user));
    }

    private toEntity(prismaUser: User): UserEntity {
        const user = new UserEntity(
            prismaUser.name,
            prismaUser.email,
            prismaUser.password,
            prismaUser.role as UserRole,
            prismaUser.image
        );
        user.id = prismaUser.id;
        user.createdAt = prismaUser.createdAt;
        user.updatedAt = prismaUser.updatedAt;
        user.createdBy = prismaUser.createdBy;
        user.updatedBy = prismaUser.updatedBy;
        return user;
    }

}
