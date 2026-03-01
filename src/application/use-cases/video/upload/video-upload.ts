import { randomUUID } from 'crypto';
import { Readable } from 'stream';

import { inject, injectable } from 'inversify';

import { IVideoUploadUseCase } from '#/application/use-cases/video/upload/video-upload.use-case';
import { ILogger } from '#/domain/services/logger.service';
import { StorageService } from '#/domain/services/storage.service';
import { TYPES } from '#/infrastructure/config/di/types';
import { VideoUploadRequest } from '#/interfaces/http/schemas/video/video-request.schema';

@injectable()
export class VideoUpload implements IVideoUploadUseCase {
    constructor(
        @inject(TYPES.Logger) private readonly logger: ILogger,
        @inject(TYPES.StorageService) private readonly storageService: StorageService,
    ) {}

    async execute(request: VideoUploadRequest): Promise<void> {
        this.logger.info('Executing video upload use case');

        const extension = request.fileName.split('.').pop();
        const uniqueName = `${randomUUID()}.${extension}`;

        const buffer = await this.streamToBuffer(request.stream);

        await this.storageService.upload({
            key: `processing/${uniqueName}`,
            body: buffer,
            contentType: request.mimetype,
        });
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
