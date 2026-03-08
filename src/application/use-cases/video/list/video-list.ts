import { inject, injectable } from 'inversify';

import { IVideoListUseCase } from '#/application/use-cases/video/list/video-list.use-case';
import { Job } from '#/domain/entities/job';
import { IJobRepository } from '#/domain/repositories/job.repository';
import { ILogger } from '#/domain/services/logger.service';
import { IStorageService } from '#/domain/services/storage.service';
import { TYPES } from '#/infrastructure/config/di/types';
import { VideoQueryRequest } from '#/interfaces/http/schemas/video/video-request.schema';

@injectable()
export class VideoList implements IVideoListUseCase {
    constructor(
        @inject(TYPES.Logger) private readonly logger: ILogger,
        @inject(TYPES.JobRepository) private readonly jobRepository: IJobRepository,
        @inject(TYPES.StorageService) private readonly storageService: IStorageService,
    ) {}

    async execute(query: VideoQueryRequest): Promise<Job[]> {
        this.logger.info('Executing video list use case', { query });

        const jobs = await this.jobRepository.list(query);

        // Generate signed URLs for DONE videos
        await Promise.all(
            jobs.map(async job => {
                if (job.status === 'DONE' && job.zipKey) {
                    try {
                        job.downloadUrl = await this.storageService.getSignedUrl(job.zipKey);
                    } catch (error) {
                        this.logger.error('Failed to generate signed URL', error as Error, { jobId: job.id });
                    }
                }
            }),
        );

        this.logger.info('Video list retrieved successfully', { count: jobs.length });

        return jobs;
    }
}
