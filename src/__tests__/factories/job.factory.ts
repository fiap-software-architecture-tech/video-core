import { makeUser } from '#/__tests__/factories/user.factory';
import { Job, JobPayload } from '#/domain/entities/job';

export const makeJob = (overrides?: Partial<JobPayload>): Job =>
    new Job({
        id: 'job-id-1',
        userId: 'user-id-1',
        originalFileName: 'video.mp4',
        originalVideoKey: 'processing/abc.mp4',
        status: 'PROCESSING',
        ...overrides,
    });

export const makeDoneJob = (overrides?: Partial<JobPayload>): Job =>
    makeJob({
        status: 'DONE',
        zipKey: 'output/abc.zip',
        frameCount: 120,
        user: makeUser(),
        ...overrides,
    });

export const makeErrorJob = (overrides?: Partial<JobPayload>): Job =>
    makeJob({
        status: 'ERROR',
        errorMessage: 'Processing failed',
        user: makeUser(),
        ...overrides,
    });
