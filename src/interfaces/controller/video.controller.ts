import { inject, injectable } from 'inversify';

import { IVideoUploadUseCase } from '#/application/use-cases/video/upload/video-upload.use-case';
import { ILogger } from '#/domain/services/logger.service';
import { TYPES } from '#/infrastructure/config/di/types';
import { VideoUploadRequest } from '#/interfaces/http/schemas/video/video-request.schema';
import { VideoPresenter } from '#/interfaces/presenter/video/video.presenter';

@injectable()
export class VideoController {
    constructor(
        @inject(TYPES.Logger) private readonly logger: ILogger,
        @inject(TYPES.VideoUploadUseCase) private readonly videoUploadUseCase: IVideoUploadUseCase,
    ) {}

    async upload(request: VideoUploadRequest): Promise<any> {
        this.logger.info('Uploading video', { file: request.fileName });
        const response = await this.videoUploadUseCase.execute(request);
        return VideoPresenter.toHTTP(response);
    }
}
