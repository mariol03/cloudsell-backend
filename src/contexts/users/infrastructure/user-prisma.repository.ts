import { prisma } from "@shared/infrastructure/prisma-singletons";
import { UserEntity, UserRole } from "../domain/user.entity";
import { UserRepository } from "../domain/user.repository";
import { User } from "../../shared/infrastructure/prisma/client";
import { SellerStats } from "../domain/seller.stats";
import { BuyerStats } from "../domain/buyer.stats";

export class UserPrismaRepository implements UserRepository {
    async save(user: UserEntity): Promise<UserEntity> {
        const existingUser = await prisma.user.findUnique({
            where: {
                id: user.id
            }
        });

        if (existingUser) {
            const updatedUser = await prisma.user.update({
                where: {
                    id: user.id
                },
                data: {
                    name: user.name,
                    email: user.email,
                    password: user.password,
                    role: user.role,
                    image: user.image,
                    updatedAt: new Date(),
                    updatedBy: user.updatedBy
                },
            });
            if (user.role === UserRole.SELLER) {
                this.updateSellerStats(user.id, user.sellerStats ?? {});
            }
            if (user.role === UserRole.BUYER) {
                this.updateBuyerStats(user.id, user.buyerStats ?? {});
            }
            return this.toEntity(updatedUser);
        }
        else {
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
            if (user.role === UserRole.SELLER) {
                await prisma.sellerStats.create({
                    data: {
                        userId: user.id,
                    }
                });
            }
            if (user.role === UserRole.BUYER) {
                await prisma.buyerStats.create({
                    data: {
                        userId: user.id,
                    }
                });
            }
            return this.toEntity(newUser);
        }
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

    async updateSellerStats(userId: string, stats: Partial<SellerStats>): Promise<void> {
        const data: SellerStats = {id: userId, rating: 0, joinedDate: '', responseTime: '', salesCount: 0, location: '', description: ''};
        if (stats.rating !== undefined) data.rating = stats.rating;
        if (stats.salesCount !== undefined) data.salesCount = stats.salesCount;
        if (stats.responseTime !== undefined) data.responseTime = stats.responseTime;
        if (stats.location !== undefined) data.location = stats.location;
        if (stats.description !== undefined) data.description = stats.description;
        if (Object.keys(data).length === 0) return;
        await prisma.sellerStats.update({
            where: { userId },
            data: {rating: data.rating, responseTime: data.responseTime, totalSales: data.salesCount, location: data.location, description: data.description},
        });
    }

    async updateBuyerStats(userId: string, stats: Partial<BuyerStats>): Promise<void> {
        const data: BuyerStats = {id: userId, purchasesCount: 0, totalSpent: 0};
        if (stats.purchasesCount !== undefined) data.purchasesCount = stats.purchasesCount;
        if (stats.totalSpent !== undefined) data.totalSpent = stats.totalSpent;
        if (Object.keys(data).length === 0) return;
        await prisma.buyerStats.update({
            where: { userId },
            data: {purchases: data.purchasesCount, totalSpent: data.totalSpent},
        });
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
