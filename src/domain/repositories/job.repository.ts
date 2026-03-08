import { Job } from '#/domain/entities/job';
import { VideoQueryRequest } from '#/interfaces/http/schemas/video/video-request.schema';

export interface IJobRepository {
    create(job: Job): Promise<Job>;
    list(query: VideoQueryRequest): Promise<Job[]>;
    update(jobId: string, data: Partial<Job>): Promise<Job>;
}
