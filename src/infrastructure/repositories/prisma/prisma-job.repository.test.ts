import { PrismaClient } from '@prisma/client';
import { Mocked } from 'vitest';
import { beforeEach, describe, expect, it } from 'vitest';

import { createMockPrismaClient, MockPrismaClient } from '#/__tests__/mocks/prisma/mock-prisma-client';
import { createMockLogger } from '#/__tests__/mocks/services/mock-logger.service';
import { Job } from '#/domain/entities/job';
import { ILogger } from '#/domain/services/logger.service';
import { PrismaJobRepository } from '#/infrastructure/repositories/prisma/prisma-job.repository';

describe('PrismaJobRepository', () => {
    let sut: PrismaJobRepository;
    let mockLogger: Mocked<ILogger>;
    let mockPrisma: MockPrismaClient;

    const prismaUser = {
        id: 'user-id-1',
        email: 'test@example.com',
        password: 'hashed-pwd',
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const prismaJobData = {
        id: 'job-id-1',
        userId: 'user-id-1',
        originalFileName: 'video.mp4',
        originalVideoKey: 'processing/abc.mp4',
        status: 'PROCESSING' as const,
        zipKey: null,
        frameCount: null,
        errorMessage: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        user: prismaUser,
    };

    beforeEach(() => {
        mockLogger = createMockLogger();
        mockPrisma = createMockPrismaClient();

        sut = new PrismaJobRepository(mockLogger, mockPrisma as unknown as PrismaClient);
    });

    describe('create', () => {
        it('should call prisma.job.create with include user and map result', async () => {
            mockPrisma.job.create.mockResolvedValue(prismaJobData);

            const job = new Job({
                userId: 'user-id-1',
                originalFileName: 'video.mp4',
                originalVideoKey: 'processing/abc.mp4',
            });
            const result = await sut.create(job);

            expect(mockPrisma.job.create).toHaveBeenCalledWith({
                data: {
                    originalFileName: 'video.mp4',
                    originalVideoKey: 'processing/abc.mp4',
                    user: { connect: { id: 'user-id-1' } },
                },
                include: { user: true },
            });
            expect(result).toBeInstanceOf(Job);
            expect(result.id).toBe('job-id-1');
        });

        it('should throw when prisma fails', async () => {
            const dbError = new Error('Database error');
            mockPrisma.job.create.mockRejectedValue(dbError);

            const job = new Job({
                userId: 'user-id-1',
                originalFileName: 'video.mp4',
                originalVideoKey: 'processing/abc.mp4',
            });

            await expect(sut.create(job)).rejects.toThrow('Database error');
        });
    });

    describe('list', () => {
        it('should apply status and userId filters when provided', async () => {
            mockPrisma.job.findMany.mockResolvedValue([prismaJobData]);

            const result = await sut.list({ status: 'done', userId: 'user-id-1' });

            expect(mockPrisma.job.findMany).toHaveBeenCalledWith({
                where: {
                    status: 'DONE',
                    userId: 'user-id-1',
                },
                include: { user: true },
            });
            expect(result).toHaveLength(1);
            expect(result[0]).toBeInstanceOf(Job);
        });

        it('should return empty array when no jobs found', async () => {
            mockPrisma.job.findMany.mockResolvedValue([]);

            const result = await sut.list({});

            expect(result).toEqual([]);
        });

        it('should not apply filters when query is empty', async () => {
            mockPrisma.job.findMany.mockResolvedValue([]);

            await sut.list({});

            expect(mockPrisma.job.findMany).toHaveBeenCalledWith({
                where: {},
                include: { user: true },
            });
        });
    });

    describe('update', () => {
        it('should call prisma.job.update and map result', async () => {
            const updatedPrismaJob = { ...prismaJobData, status: 'DONE' as const, zipKey: 'output/abc.zip' };
            mockPrisma.job.update.mockResolvedValue(updatedPrismaJob);

            const result = await sut.update('job-id-1', { status: 'DONE', zipKey: 'output/abc.zip' });

            expect(mockPrisma.job.update).toHaveBeenCalledWith({
                where: { id: 'job-id-1' },
                data: { status: 'DONE', zipKey: 'output/abc.zip' },
                include: { user: true },
            });
            expect(result).toBeInstanceOf(Job);
            expect(result.status).toBe('DONE');
        });

        it('should throw on failure', async () => {
            const dbError = new Error('Record not found');
            mockPrisma.job.update.mockRejectedValue(dbError);

            await expect(sut.update('bad-id', { status: 'DONE' })).rejects.toThrow('Record not found');
        });
    });

    describe('findById', () => {
        it('should return Job when found', async () => {
            mockPrisma.job.findUnique.mockResolvedValue(prismaJobData);

            const result = await sut.findById('job-id-1');

            expect(mockPrisma.job.findUnique).toHaveBeenCalledWith({
                where: { id: 'job-id-1' },
                include: { user: true },
            });
            expect(result).toBeInstanceOf(Job);
            expect(result?.id).toBe('job-id-1');
        });

        it('should return null when not found', async () => {
            mockPrisma.job.findUnique.mockResolvedValue(null);

            const result = await sut.findById('nonexistent');

            expect(result).toBeNull();
        });

        it('should throw on failure', async () => {
            const dbError = new Error('Connection lost');
            mockPrisma.job.findUnique.mockRejectedValue(dbError);

            await expect(sut.findById('job-id-1')).rejects.toThrow('Connection lost');
        });
    });
});
