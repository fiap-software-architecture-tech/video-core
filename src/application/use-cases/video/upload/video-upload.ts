import { randomUUID } from 'crypto';
import { Readable } from 'stream';

import { inject, injectable } from 'inversify';

import { IVideoUploadUseCase } from '#/application/use-cases/video/upload/video-upload.use-case';
import { Job } from '#/domain/entities/job';
import { IJobRepository } from '#/domain/repositories/job.repository';
import { ILogger } from '#/domain/services/logger.service';
import { IQueueProviderService } from '#/domain/services/queue-provider.service';
import { IStorageService } from '#/domain/services/storage.service';
import { TYPES } from '#/infrastructure/config/di/types';
import { VideoUploadRequest } from '#/interfaces/http/schemas/video/video-request.schema';

@injectable()
export class VideoUpload implements IVideoUploadUseCase {
    constructor(
        @inject(TYPES.Logger) private readonly logger: ILogger,
        @inject(TYPES.StorageService) private readonly storageService: IStorageService,
        @inject(TYPES.JobRepository) private readonly jobRepository: IJobRepository,
        @inject(TYPES.QueueProviderService) private readonly queueProviderService: IQueueProviderService,
    ) {}

    async execute(request: VideoUploadRequest): Promise<Job> {
        this.logger.info('Executing video upload use case', { fileName: request.fileName });

        const extension = request.fileName.split('.').pop();
        const key = `processing/${randomUUID()}.${extension}`;

        const buffer = await this.streamToBuffer(request.stream);

        await this.storageService.upload({
            key,
            body: buffer,
            contentType: request.mimetype,
        });

        const job = new Job({
            originalFileName: request.fileName,
            originalVideoKey: key,
        });

        const jobCreated = await this.jobRepository.create(job);

        await this.queueProviderService.send({
            jobId: jobCreated.id,
            key,
        });

        this.logger.info('Video uploaded successfully');

        return jobCreated;
    }

    private streamToBuffer(stream: Readable): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            const chunks: Buffer[] = [];
            stream.on('data', chunk => chunks.push(Buffer.from(chunk)));
            stream.on('end', () => resolve(Buffer.concat(chunks)));
            stream.on('error', reject);
        });
    }
}
