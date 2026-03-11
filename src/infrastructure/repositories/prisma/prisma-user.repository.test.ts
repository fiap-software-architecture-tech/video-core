import { PrismaClient } from '@prisma/client';
import { Mocked } from 'vitest';
import { beforeEach, describe, expect, it } from 'vitest';

import { createMockPrismaClient, MockPrismaClient } from '#/__tests__/mocks/prisma/mock-prisma-client';
import { createMockLogger } from '#/__tests__/mocks/services/mock-logger.service';
import { User } from '#/domain/entities/user';
import { ILogger } from '#/domain/services/logger.service';
import { PrismaUserRepository } from '#/infrastructure/repositories/prisma/prisma-user.repository';

describe('PrismaUserRepository', () => {
    let sut: PrismaUserRepository;
    let mockLogger: Mocked<ILogger>;
    let mockPrisma: MockPrismaClient;

    const prismaUserData = {
        id: 'user-id-1',
        email: 'test@example.com',
        password: 'hashed-pwd',
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    beforeEach(() => {
        mockLogger = createMockLogger();
        mockPrisma = createMockPrismaClient();

        sut = new PrismaUserRepository(mockLogger, mockPrisma as unknown as PrismaClient);
    });

    describe('create', () => {
        it('should call prisma.user.create and map result to domain User', async () => {
            mockPrisma.user.create.mockResolvedValue(prismaUserData);

            const user = new User({ email: 'test@example.com', password: 'hashed-pwd' });
            const result = await sut.create(user);

            expect(mockPrisma.user.create).toHaveBeenCalledWith({
                data: { email: 'test@example.com', password: 'hashed-pwd' },
            });
            expect(result).toBeInstanceOf(User);
            expect(result.id).toBe('user-id-1');
            expect(result.email).toBe('test@example.com');
        });

        it('should throw when prisma fails', async () => {
            const dbError = new Error('Database connection failed');
            mockPrisma.user.create.mockRejectedValue(dbError);

            const user = new User({ email: 'test@example.com', password: 'hashed-pwd' });

            await expect(sut.create(user)).rejects.toThrow('Database connection failed');
        });
    });

    describe('findByEmail', () => {
        it('should return User when found', async () => {
            mockPrisma.user.findFirst.mockResolvedValue(prismaUserData);

            const result = await sut.findByEmail('test@example.com');

            expect(mockPrisma.user.findFirst).toHaveBeenCalledWith({
                where: { email: 'test@example.com' },
            });
            expect(result).toBeInstanceOf(User);
            expect(result?.email).toBe('test@example.com');
        });

        it('should return null when not found', async () => {
            mockPrisma.user.findFirst.mockResolvedValue(null);

            const result = await sut.findByEmail('nonexistent@example.com');

            expect(result).toBeNull();
        });
    });
});
