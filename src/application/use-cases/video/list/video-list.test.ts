import { Mocked } from 'vitest';
import { beforeEach, describe, expect, it } from 'vitest';

import { makeDoneJob, makeJob } from '#/__tests__/factories/job.factory';
import { createMockJobRepository } from '#/__tests__/mocks/repositories/mock-job.repository';
import { createMockLogger } from '#/__tests__/mocks/services/mock-logger.service';
import { createMockStorageService } from '#/__tests__/mocks/services/mock-storage.service';
import { VideoList } from '#/application/use-cases/video/list/video-list';
import { IJobRepository } from '#/domain/repositories/job.repository';
import { ILogger } from '#/domain/services/logger.service';
import { IStorageService } from '#/domain/services/storage.service';

describe('VideoList', () => {
    let sut: VideoList;
    let mockLogger: Mocked<ILogger>;
    let mockJobRepository: Mocked<IJobRepository>;
    let mockStorageService: Mocked<IStorageService>;

    beforeEach(() => {
        mockLogger = createMockLogger();
        mockJobRepository = createMockJobRepository();
        mockStorageService = createMockStorageService();

        sut = new VideoList(mockLogger, mockJobRepository, mockStorageService);
    });

    it('should return jobs with signed URLs for DONE status', async () => {
        const doneJob = makeDoneJob();
        const signedUrl = 'https://s3.example.com/signed-url';

        mockJobRepository.list.mockResolvedValue([doneJob]);
        mockStorageService.getSignedUrl.mockResolvedValue(signedUrl);

        const result = await sut.execute({});

        expect(mockStorageService.getSignedUrl).toHaveBeenCalledWith(doneJob.zipKey);
        expect(result[0].downloadUrl).toBe(signedUrl);
    });

    it('should not generate signed URL for non-DONE jobs', async () => {
        const processingJob = makeJob({ status: 'PROCESSING' });

        mockJobRepository.list.mockResolvedValue([processingJob]);

        const result = await sut.execute({});

        expect(mockStorageService.getSignedUrl).not.toHaveBeenCalled();
        expect(result[0].downloadUrl).toBeUndefined();
    });

    it('should handle getSignedUrl failure gracefully', async () => {
        const doneJob = makeDoneJob();

        mockJobRepository.list.mockResolvedValue([doneJob]);
        mockStorageService.getSignedUrl.mockRejectedValue(new Error('S3 error'));

        const result = await sut.execute({});

        expect(result[0].downloadUrl).toBeUndefined();
    });

    it('should return empty array when no jobs exist', async () => {
        mockJobRepository.list.mockResolvedValue([]);

        const result = await sut.execute({});

        expect(result).toEqual([]);
        expect(mockStorageService.getSignedUrl).not.toHaveBeenCalled();
    });

    it('should pass query parameters to repository', async () => {
        mockJobRepository.list.mockResolvedValue([]);

        await sut.execute({ status: 'done', userId: 'user-123' });

        expect(mockJobRepository.list).toHaveBeenCalledWith({ status: 'done', userId: 'user-123' });
    });
});
