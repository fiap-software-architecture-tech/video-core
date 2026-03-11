import { Mocked, vi } from 'vitest';

import { IHashService } from '#/domain/services/hash.service';

export const createMockHashService = (): Mocked<IHashService> => ({
    hash: vi.fn(),
    compare: vi.fn(),
});
