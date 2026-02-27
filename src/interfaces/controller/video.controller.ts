import { MultipartFile } from '@fastify/multipart';
import { inject, injectable } from 'inversify';

import { IVideoUploadUseCase } from '#/application/use-cases/video/upload/video-upload.use-case';
import { ILogger } from '#/domain/services/logger.service';
import { TYPES } from '#/infrastructure/config/di/types';
import { VideoPresenter } from '#/interfaces/presenter/video/video.presenter';

@injectable()
export class VideoController {
    constructor(
        @inject(TYPES.Logger) private readonly logger: ILogger,
        @inject(TYPES.VideoUploadUseCase) private readonly videoUploadUseCase: IVideoUploadUseCase,
    ) {}

    async upload(file: MultipartFile): Promise<any> {
        this.logger.info('Uploading video', { file: file.filename });
        const response = await this.videoUploadUseCase.execute(file);
        return VideoPresenter.toHTTP(response);
    }
}
