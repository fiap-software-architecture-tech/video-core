import { inject, injectable } from 'inversify';

import { IVideoListUseCase } from '#/application/use-cases/video/list/video-list.use-case';
import { Job } from '#/domain/entities/job';
import { IJobRepository } from '#/domain/repositories/job.repository';
import { ILogger } from '#/domain/services/logger.service';
import { TYPES } from '#/infrastructure/config/di/types';
import { VideoQueryRequest } from '#/interfaces/http/schemas/video/video-request.schema';

@injectable()
export class VideoList implements IVideoListUseCase {
    constructor(
        @inject(TYPES.Logger) private readonly logger: ILogger,
        @inject(TYPES.JobRepository) private readonly jobRepository: IJobRepository,
    ) {}

    async execute(query: VideoQueryRequest): Promise<Job[]> {
        this.logger.info('Executing video list use case', { query });

        const jobs = await this.jobRepository.list(query);

        this.logger.info('Video list retrieved successfully', { count: jobs.length });

        return jobs;
    }
}
