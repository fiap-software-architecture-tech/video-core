import { inject, injectable } from 'inversify';

import { IVideoListUseCase } from '#/application/use-cases/video/list/video-list.use-case';
import { IVideoUploadUseCase } from '#/application/use-cases/video/upload/video-upload.use-case';
import { ILogger } from '#/domain/services/logger.service';
import { TYPES } from '#/infrastructure/config/di/types';
import { VideoQueryRequest, VideoUploadRequest } from '#/interfaces/http/schemas/video/video-request.schema';
import { VideoResponse } from '#/interfaces/http/schemas/video/video-response.schema';
import { VideoPresenter } from '#/interfaces/presenter/video/video.presenter';

@injectable()
export class VideoController {
    constructor(
        @inject(TYPES.Logger) private readonly logger: ILogger,
        @inject(TYPES.VideoUploadUseCase) private readonly videoUploadUseCase: IVideoUploadUseCase,
        @inject(TYPES.VideoListUseCase) private readonly videoListUseCase: IVideoListUseCase,
    ) {}

    async upload(request: VideoUploadRequest): Promise<VideoResponse> {
        this.logger.info('Uploading video', { file: request.fileName });
        const response = await this.videoUploadUseCase.execute(request);
        return VideoPresenter.toHTTP(response);
    }

    async list(query: VideoQueryRequest): Promise<VideoResponse[]> {
        this.logger.info('Listing videos', { query });
        const response = await this.videoListUseCase.execute(query);
        return response.map(item => VideoPresenter.toHTTP(item));
    }
}
