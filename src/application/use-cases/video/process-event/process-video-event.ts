import { inject, injectable } from 'inversify';

import { IProcessVideoEventUseCase, ProcessVideoEventRequest } from '#/application/use-cases/video/process-event/process-video-event.use-case';
import { EventType } from '#/domain/enum/event-type';
import { IJobRepository } from '#/domain/repositories/job.repository';
import { ILogger } from '#/domain/services/logger.service';
import { TYPES } from '#/infrastructure/config/di/types';

@injectable()
export class ProcessVideoEvent implements IProcessVideoEventUseCase {
    constructor(
        @inject(TYPES.Logger) private readonly logger: ILogger,
        @inject(TYPES.JobRepository) private readonly jobRepository: IJobRepository,
    ) {}

    async execute(request: ProcessVideoEventRequest): Promise<void> {
        this.logger.info('Processing video event', { request });

        try {
            if (request.eventType === EventType.DONE) {
                await this.jobRepository.update(request.jobId, {
                    status: 'DONE',
                    zipKey: request.zipKey,
                    frameCount: request.frameCount,
                });
                this.logger.info('Job marked as DONE', { jobId: request.jobId });
            } else if (request.eventType === EventType.ERROR) {
                await this.jobRepository.update(request.jobId, {
                    status: 'ERROR',
                    errorMessage: request.error,
                });
                this.logger.info('Job marked as ERROR', { jobId: request.jobId });
            }
        } catch (error) {
            this.logger.error('Failed to process video event', error as Error, { request });
            throw error;
        }
    }
}
