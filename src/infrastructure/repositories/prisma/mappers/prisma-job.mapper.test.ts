import { describe, expect, it } from 'vitest';

import { Job } from '#/domain/entities/job';
import { PrismaJobMapper } from '#/infrastructure/repositories/prisma/mappers/prisma-job.mapper';

describe('PrismaJobMapper', () => {
    const prismaJob = {
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
    };

    const prismaUser = {
        id: 'user-id-1',
        email: 'test@example.com',
        password: 'hashed-pwd',
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    describe('toDomain', () => {
        it('should map a Prisma job to a domain Job entity', () => {
            const result = PrismaJobMapper.toDomain({ ...prismaJob, user: prismaUser });

            expect(result).toBeInstanceOf(Job);
            expect(result.id).toBe('job-id-1');
            expect(result.userId).toBe('user-id-1');
            expect(result.originalFileName).toBe('video.mp4');
            expect(result.originalVideoKey).toBe('processing/abc.mp4');
            expect(result.status).toBe('PROCESSING');
        });

        it('should map nullable fields as undefined', () => {
            const result = PrismaJobMapper.toDomain({ ...prismaJob, user: prismaUser });

            expect(result.zipKey).toBeUndefined();
            expect(result.frameCount).toBeUndefined();
            expect(result.errorMessage).toBeUndefined();
        });

        it('should include user when present', () => {
            const result = PrismaJobMapper.toDomain({ ...prismaJob, user: prismaUser });

            expect(result.user).toBeDefined();
            expect(result.user?.email).toBe('test@example.com');
        });

        it('should map a DONE job with zipKey and frameCount', () => {
            const doneJob = {
                ...prismaJob,
                status: 'DONE' as const,
                zipKey: 'output/abc.zip',
                frameCount: 120,
                user: prismaUser,
            };

            const result = PrismaJobMapper.toDomain(doneJob);

            expect(result.status).toBe('DONE');
            expect(result.zipKey).toBe('output/abc.zip');
            expect(result.frameCount).toBe(120);
        });
    });

    describe('toCreate', () => {
        it('should map a domain Job to Prisma create input', () => {
            const job = new Job({
                userId: 'user-id-1',
                originalFileName: 'video.mp4',
                originalVideoKey: 'processing/abc.mp4',
            });

            const result = PrismaJobMapper.toCreate(job);

            expect(result).toEqual({
                originalFileName: 'video.mp4',
                originalVideoKey: 'processing/abc.mp4',
                user: {
                    connect: { id: 'user-id-1' },
                },
            });
        });
    });

    describe('toUpdate', () => {
        it('should map partial job data for status update', () => {
            const result = PrismaJobMapper.toUpdate({ status: 'DONE' });

            expect(result).toEqual({ status: 'DONE' });
        });

        it('should map partial job data with all optional fields', () => {
            const result = PrismaJobMapper.toUpdate({
                status: 'DONE',
                zipKey: 'output/abc.zip',
                frameCount: 120,
            });

            expect(result).toEqual({
                status: 'DONE',
                zipKey: 'output/abc.zip',
                frameCount: 120,
            });
        });

        it('should include errorMessage when provided', () => {
            const result = PrismaJobMapper.toUpdate({
                status: 'ERROR',
                errorMessage: 'Something failed',
            });

            expect(result).toEqual({
                status: 'ERROR',
                errorMessage: 'Something failed',
            });
        });

        it('should return empty object when no fields provided', () => {
            const result = PrismaJobMapper.toUpdate({});

            expect(result).toEqual({});
        });
    });
});
