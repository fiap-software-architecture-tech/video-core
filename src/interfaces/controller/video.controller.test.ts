import { Readable } from 'stream';

import { Mocked } from 'vitest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { makeDoneJob, makeJob } from '#/__tests__/factories/job.factory';
import { makeUser } from '#/__tests__/factories/user.factory';
import { createMockLogger } from '#/__tests__/mocks/services/mock-logger.service';
import { IVideoListUseCase } from '#/application/use-cases/video/list/video-list.use-case';
import { IVideoUploadUseCase } from '#/application/use-cases/video/upload/video-upload.use-case';
import { ILogger } from '#/domain/services/logger.service';
import { VideoController } from '#/interfaces/controller/video.controller';

describe('VideoController', () => {
    let sut: VideoController;
    let mockLogger: Mocked<ILogger>;
    let mockVideoUploadUseCase: { execute: ReturnType<typeof vi.fn> };
    let mockVideoListUseCase: { execute: ReturnType<typeof vi.fn> };

    beforeEach(() => {
        mockLogger = createMockLogger();
        mockVideoUploadUseCase = { execute: vi.fn() };
        mockVideoListUseCase = { execute: vi.fn() };

        sut = new VideoController(
            mockLogger,
            mockVideoUploadUseCase as IVideoUploadUseCase,
            mockVideoListUseCase as IVideoListUseCase,
        );
    });

    describe('upload', () => {
        it('should call videoUploadUseCase and return VideoPresenter output', async () => {
            const user = makeUser();
            const job = makeJob({ user });
            const request = {
                userId: 'user-id-1',
                fileName: 'video.mp4',
                mimetype: 'video/mp4',
                fileSize: 1024,
                stream: Readable.from(Buffer.from('data')),
            };

            mockVideoUploadUseCase.execute.mockResolvedValue(job);

            const result = await sut.upload(request);

            expect(mockVideoUploadUseCase.execute).toHaveBeenCalledWith(request);
            expect(result).toHaveProperty('id', job.id);
            expect(result).toHaveProperty('originalFileName', 'video.mp4');
            expect(result).toHaveProperty('status');
            expect(result).toHaveProperty('user');
        });
    });

    describe('list', () => {
        it('should call videoListUseCase and map each job through VideoPresenter', async () => {
            const user = makeUser();
            const jobs = [makeJob({ id: 'job-1', user }), makeDoneJob({ id: 'job-2' })];

            mockVideoListUseCase.execute.mockResolvedValue(jobs);

            const result = await sut.list({});

            expect(mockVideoListUseCase.execute).toHaveBeenCalledWith({});
            expect(result).toHaveLength(2);
            expect(result[0]).toHaveProperty('id', 'job-1');
            expect(result[1]).toHaveProperty('id', 'job-2');
            result.forEach(item => {
                expect(item).toHaveProperty('originalFileName');
                expect(item).toHaveProperty('status');
                expect(item).toHaveProperty('user');
            });
        });

        it('should return empty array when no videos exist', async () => {
            mockVideoListUseCase.execute.mockResolvedValue([]);

            const result = await sut.list({});

            expect(result).toEqual([]);
        });
    });
});
