import { Job } from '#/domain/entities/job';
import { VideoUploadRequest } from '#/interfaces/http/schemas/video/video-request.schema';

export interface IVideoUploadUseCase {
    execute(request: VideoUploadRequest): Promise<Job>;
}
