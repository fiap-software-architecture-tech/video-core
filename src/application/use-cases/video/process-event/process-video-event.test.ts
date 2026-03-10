import { Mocked } from 'vitest';
import { beforeEach, describe, expect, it } from 'vitest';

import { makeJob } from '#/__tests__/factories/job.factory';
import { makeUser } from '#/__tests__/factories/user.factory';
import { createMockJobRepository } from '#/__tests__/mocks/repositories/mock-job.repository';
import { createMockEmailService } from '#/__tests__/mocks/services/mock-email.service';
import { createMockLogger } from '#/__tests__/mocks/services/mock-logger.service';
import { ProcessVideoEvent } from '#/application/use-cases/video/process-event/process-video-event';
import { EventType } from '#/domain/enum/event-type';
import { IJobRepository } from '#/domain/repositories/job.repository';
import { IEmailService } from '#/domain/services/email.service';
import { ILogger } from '#/domain/services/logger.service';

describe('ProcessVideoEvent', () => {
    let sut: ProcessVideoEvent;
    let mockLogger: Mocked<ILogger>;
    let mockJobRepository: Mocked<IJobRepository>;
    let mockEmailService: Mocked<IEmailService>;

    beforeEach(() => {
        mockLogger = createMockLogger();
        mockJobRepository = createMockJobRepository();
        mockEmailService = createMockEmailService();

        sut = new ProcessVideoEvent(mockLogger, mockJobRepository, mockEmailService);
    });

    it('should mark job as DONE with zipKey and frameCount', async () => {
        mockJobRepository.update.mockResolvedValue(makeJob({ status: 'DONE' }));

        await sut.execute({
            jobId: 'job-id-1',
            eventType: EventType.DONE,
            zipKey: 'output/abc.zip',
            frameCount: 120,
        });

        expect(mockJobRepository.update).toHaveBeenCalledWith('job-id-1', {
            status: 'DONE',
            zipKey: 'output/abc.zip',
            frameCount: 120,
        });
    });

    it('should mark job as ERROR and send notification email', async () => {
        const user = makeUser({ email: 'user@example.com' });
        const job = makeJob({ id: 'job-id-1', user, originalFileName: 'video.mp4' });

        mockJobRepository.findById.mockResolvedValue(job);
        mockJobRepository.update.mockResolvedValue(makeJob({ status: 'ERROR' }));
        mockEmailService.send.mockResolvedValue(undefined);

        await sut.execute({
            jobId: 'job-id-1',
            eventType: EventType.ERROR,
            error: 'Codec not supported',
        });

        expect(mockJobRepository.findById).toHaveBeenCalledWith('job-id-1');
        expect(mockJobRepository.update).toHaveBeenCalledWith('job-id-1', {
            status: 'ERROR',
            errorMessage: 'Codec not supported',
        });
        expect(mockEmailService.send).toHaveBeenCalledWith(
            expect.objectContaining({
                to: 'user@example.com',
            }),
        );
    });

    it('should handle ERROR event when job is not found', async () => {
        mockJobRepository.findById.mockResolvedValue(null);

        await sut.execute({
            jobId: 'non-existent',
            eventType: EventType.ERROR,
            error: 'Something failed',
        });

        expect(mockJobRepository.update).not.toHaveBeenCalled();
        expect(mockEmailService.send).not.toHaveBeenCalled();
    });

    it('should not fail processing if email send fails', async () => {
        const user = makeUser({ email: 'user@example.com' });
        const job = makeJob({ id: 'job-id-1', user });

        mockJobRepository.findById.mockResolvedValue(job);
        mockJobRepository.update.mockResolvedValue(makeJob({ status: 'ERROR' }));
        mockEmailService.send.mockRejectedValue(new Error('SMTP error'));

        await expect(
            sut.execute({
                jobId: 'job-id-1',
                eventType: EventType.ERROR,
                error: 'Processing failed',
            }),
        ).resolves.not.toThrow();
    });

    it('should not send email if job has no user email', async () => {
        const job = makeJob({ id: 'job-id-1', user: undefined });

        mockJobRepository.findById.mockResolvedValue(job);
        mockJobRepository.update.mockResolvedValue(makeJob({ status: 'ERROR' }));

        await sut.execute({
            jobId: 'job-id-1',
            eventType: EventType.ERROR,
            error: 'Processing failed',
        });

        expect(mockEmailService.send).not.toHaveBeenCalled();
    });
});
