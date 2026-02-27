import { randomUUID } from 'crypto';
import { createWriteStream, promises } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { pipeline } from 'stream/promises';

import { MultipartFile } from '@fastify/multipart';
import { inject, injectable } from 'inversify';

import { IVideoUploadUseCase } from '#/application/use-cases/video/upload/video-upload.use-case';
import { ILogger } from '#/domain/services/logger.service';
import { TYPES } from '#/infrastructure/config/di/types';

@injectable()
export class VideoUpload implements IVideoUploadUseCase {
    constructor(@inject(TYPES.Logger) private readonly logger: ILogger) {}

    async execute(file: MultipartFile): Promise<any> {
        this.logger.info('Executing video upload use case');

        const ext = file.filename.slice(file.filename.lastIndexOf('.')).toLowerCase();

        const tmpPath = join(tmpdir(), `${randomUUID()}${ext}`);
        try {
            await pipeline(file.file, createWriteStream(tmpPath));

            this.logger.info('Saving uploaded file to temporary path', { tmpPath });
        } catch (error) {
            this.logger.error('Error uploading video', error as Error);
            throw new Error('Failed to upload video');
        } finally {
            await promises.unlink(tmpPath).catch(() => {});
        }
    }
}
