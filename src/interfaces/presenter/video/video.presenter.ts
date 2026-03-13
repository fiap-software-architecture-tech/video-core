import { Job } from '#/domain/entities/job';
import { VideoResponse } from '#/interfaces/http/schemas/video/video-response.schema';

export class VideoPresenter {
    static toHTTP(job: Job): VideoResponse {
        return {
            id: job.id,
            originalFileName: job.originalFileName,
            originalVideoKey: job.originalVideoKey,
            status: job.status ?? '',
            zipKey: job.zipKey ?? null,
            frameCount: job.frameCount ?? null,
            errorMessage: job.errorMessage ?? null,
            downloadUrl: job.downloadUrl ?? null,
            user: {
                id: job.user?.id ?? '',
                email: job.user?.email ?? '',
            },
        };
    }
}
