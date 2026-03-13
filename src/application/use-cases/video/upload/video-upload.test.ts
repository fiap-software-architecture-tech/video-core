import { Readable } from 'stream';

import { Mocked } from 'vitest';
import { beforeEach, describe, expect, it } from 'vitest';

import { makeJob } from '#/__tests__/factories/job.factory';
import { createMockJobRepository } from '#/__tests__/mocks/repositories/mock-job.repository';
import { createMockLogger } from '#/__tests__/mocks/services/mock-logger.service';
import { createMockQueueProviderService } from '#/__tests__/mocks/services/mock-queue-provider.service';
import { createMockStorageService } from '#/__tests__/mocks/services/mock-storage.service';
import { VideoUpload } from '#/application/use-cases/video/upload/video-upload';
import { EventType } from '#/domain/enum/event-type';
import { IJobRepository } from '#/domain/repositories/job.repository';
import { ILogger } from '#/domain/services/logger.service';
import { IQueueProviderService } from '#/domain/services/queue-provider.service';
import { IStorageService } from '#/domain/services/storage.service';
import { VideoUploadRequest } from '#/interfaces/http/schemas/video/video-request.schema';

describe('VideoUpload', () => {
    let sut: VideoUpload;
    let mockLogger: Mocked<ILogger>;
    let mockStorageService: Mocked<IStorageService>;
    let mockJobRepository: Mocked<IJobRepository>;
    let mockQueueProviderService: Mocked<IQueueProviderService>;

    beforeEach(() => {
        mockLogger = createMockLogger();
        mockStorageService = createMockStorageService();
        mockJobRepository = createMockJobRepository();
        mockQueueProviderService = createMockQueueProviderService();

        sut = new VideoUpload(mockLogger, mockStorageService, mockJobRepository, mockQueueProviderService);
    });

    const createUploadRequest = (overrides?: Partial<VideoUploadRequest>): VideoUploadRequest => ({
        userId: 'user-id-1',
        fileName: 'test-video.mp4',
        mimetype: 'video/mp4',
        fileSize: 1024,
        stream: Readable.from(Buffer.from('fake-video-content')),
        ...overrides,
    });

    it('should upload video, create job, and enqueue message', async () => {
        const request = createUploadRequest();
        const createdJob = makeJob({ userId: request.userId, originalFileName: request.fileName });

        mockStorageService.upload.mockResolvedValue(undefined);
        mockJobRepository.create.mockResolvedValue(createdJob);
        mockQueueProviderService.send.mockResolvedValue(undefined);

        const result = await sut.execute(request);

        expect(mockStorageService.upload).toHaveBeenCalledWith(
            expect.objectContaining({
                key: expect.stringMatching(/^processing\/.*\.mp4$/),
                body: expect.any(Buffer),
                contentType: 'video/mp4',
            }),
        );
        expect(mockJobRepository.create).toHaveBeenCalledWith(
            expect.objectContaining({
                userId: 'user-id-1',
                originalFileName: 'test-video.mp4',
            }),
        );
        expect(mockQueueProviderService.send).toHaveBeenCalledWith(
            expect.objectContaining({
                jobId: createdJob.id,
                eventType: EventType.PROCESSING,
            }),
        );
        expect(result).toBe(createdJob);
    });

    it('should propagate storage upload errors', async () => {
        const request = createUploadRequest();
        const uploadError = new Error('S3 upload failed');

        mockStorageService.upload.mockRejectedValue(uploadError);

        await expect(sut.execute(request)).rejects.toThrow('S3 upload failed');
        expect(mockJobRepository.create).not.toHaveBeenCalled();
        expect(mockQueueProviderService.send).not.toHaveBeenCalled();
    });

    it('should preserve file extension in the storage key', async () => {
        const request = createUploadRequest({ fileName: 'recording.avi' });

        mockStorageService.upload.mockResolvedValue(undefined);
        mockJobRepository.create.mockResolvedValue(makeJob());
        mockQueueProviderService.send.mockResolvedValue(undefined);

        await sut.execute(request);

        expect(mockStorageService.upload).toHaveBeenCalledWith(
            expect.objectContaining({
                key: expect.stringMatching(/^processing\/.*\.avi$/),
            }),
        );
    });
});
