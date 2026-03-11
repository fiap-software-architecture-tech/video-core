import { describe, expect, it } from 'vitest';

import { makeDoneJob, makeJob } from '#/__tests__/factories/job.factory';
import { makeUser } from '#/__tests__/factories/user.factory';
import { VideoPresenter } from '#/interfaces/presenter/video/video.presenter';

describe('VideoPresenter', () => {
    describe('toHTTP', () => {
        it('should map a DONE job with all fields', () => {
            const job = makeDoneJob();
            job.downloadUrl = 'https://s3.example.com/signed-url';

            const result = VideoPresenter.toHTTP(job);

            expect(result).toEqual({
                id: job.id,
                originalFileName: 'video.mp4',
                originalVideoKey: 'processing/abc.mp4',
                status: 'DONE',
                zipKey: 'output/abc.zip',
                frameCount: 120,
                errorMessage: null,
                downloadUrl: 'https://s3.example.com/signed-url',
                user: {
                    id: 'user-id-1',
                    email: 'test@example.com',
                },
            });
        });

        it('should map a job with nullable fields as null', () => {
            const job = makeJob({ user: makeUser() });

            const result = VideoPresenter.toHTTP(job);

            expect(result.zipKey).toBeNull();
            expect(result.frameCount).toBeNull();
            expect(result.errorMessage).toBeNull();
            expect(result.downloadUrl).toBeNull();
        });

        it('should handle missing user gracefully', () => {
            const job = makeJob();

            const result = VideoPresenter.toHTTP(job);

            expect(result.user).toEqual({
                id: '',
                email: '',
            });
        });
    });
});
