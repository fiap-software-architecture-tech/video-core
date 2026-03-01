import { VideoUploadRequest } from '#/interfaces/http/schemas/video/video-request.schema';

export interface IVideoUploadUseCase {
    execute(request: VideoUploadRequest): Promise<any>;
}
