import { Mocked, vi } from 'vitest';

import { IJobRepository } from '#/domain/repositories/job.repository';

export const createMockJobRepository = (): Mocked<IJobRepository> => ({
    create: vi.fn(),
    list: vi.fn(),
    update: vi.fn(),
    findById: vi.fn(),
});
