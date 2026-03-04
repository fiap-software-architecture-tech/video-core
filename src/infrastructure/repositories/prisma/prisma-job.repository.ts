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
            },
            include: {
                user: true,
            },
        });
        this.logger.info('Jobs retrieved from database', { count: data.length });
        return data.map(item => PrismaJobMapper.toDomain(item));
    }
}
