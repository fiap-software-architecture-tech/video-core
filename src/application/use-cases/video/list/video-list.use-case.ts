import { Job } from '#/domain/entities/job';
import { VideoQueryRequest } from '#/interfaces/http/schemas/video/video-request.schema';

export interface IVideoListUseCase {
    execute(query: VideoQueryRequest): Promise<Job[]>;
}
