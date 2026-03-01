import { PrismaClient } from '@prisma/client';
import { inject, injectable } from 'inversify';

import { Job } from '#/domain/entities/job';
import { IJobRepository } from '#/domain/repositories/job.repository';
import { ILogger } from '#/domain/services/logger.service';
import { TYPES } from '#/infrastructure/config/di/types';
import { PrismaJobMapper } from '#/infrastructure/repositories/prisma/mappers/prisma-job.mapper';

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

    list(): Promise<Job[]> {
        throw new Error('Method not implemented.');
    }
}
