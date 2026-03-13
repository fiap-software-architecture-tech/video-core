import { JobStatus, PrismaClient } from '@prisma/client';
import { inject, injectable } from 'inversify';

import { Job } from '#/domain/entities/job';
import { IJobRepository } from '#/domain/repositories/job.repository';
import { ILogger } from '#/domain/services/logger.service';
import { TYPES } from '#/infrastructure/config/di/types';
import { PrismaJobMapper } from '#/infrastructure/repositories/prisma/mappers/prisma-job.mapper';
import { VideoQueryRequest } from '#/interfaces/http/schemas/video/video-request.schema';

@injectable()
export class PrismaJobRepository implements IJobRepository {
    constructor(
        @inject(TYPES.Logger) private readonly logger: ILogger,
        @inject(TYPES.PrismaClient) private readonly prisma: PrismaClient,
    ) {}

    async create(job: Job): Promise<Job> {
        try {
            this.logger.info('Creating job in database', { originalFileName: job.originalFileName });
            const data = await this.prisma.job.create({
                data: PrismaJobMapper.toCreate(job),
                include: {
                    user: true,
                },
            });
            const result = PrismaJobMapper.toDomain(data);
            this.logger.info('Job created in database', { jobId: result.id });
            return result;
        } catch (error) {
            this.logger.error('Failed to create job in database', error as Error, {
                originalFileName: job.originalFileName,
            });
            throw error;
        }
    }

    async list(query: VideoQueryRequest): Promise<Job[]> {
        this.logger.info('Listing jobs from database', { query });
        const data = await this.prisma.job.findMany({
            where: {
                ...(query.status ? { status: query.status.toUpperCase() as JobStatus } : {}),
                ...(query.userId ? { userId: query.userId } : {}),
            },
            include: {
                user: true,
            },
        });
        this.logger.info('Jobs retrieved from database', { count: data.length });
        return data.map(item => PrismaJobMapper.toDomain(item));
    }

    async update(jobId: string, data: Partial<Job>): Promise<Job> {
        try {
            this.logger.info('Updating job in database', { jobId, data });
            const updated = await this.prisma.job.update({
                where: { id: jobId },
                data: PrismaJobMapper.toUpdate(data),
                include: {
                    user: true,
                },
            });
            const result = PrismaJobMapper.toDomain(updated);
            this.logger.info('Job updated in database', { jobId });
            return result;
        } catch (error) {
            this.logger.error('Failed to update job in database', error as Error, { jobId });
            throw error;
        }
    }

    async findById(jobId: string): Promise<Job | null> {
        try {
            this.logger.info('Finding job by ID', { jobId });
            const data = await this.prisma.job.findUnique({
                where: { id: jobId },
                include: {
                    user: true,
                },
            });

            if (!data) {
                this.logger.info('Job not found', { jobId });
                return null;
            }

            const result = PrismaJobMapper.toDomain(data);
            this.logger.info('Job found', { jobId });
            return result;
        } catch (error) {
            this.logger.error('Failed to find job by ID', error as Error, { jobId });
            throw error;
        }
    }
}
