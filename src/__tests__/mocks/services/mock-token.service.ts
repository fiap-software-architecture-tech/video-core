import { Mocked, vi } from 'vitest';

import { ITokenService } from '#/domain/services/token.service';

export const createMockTokenService = (): Mocked<ITokenService> => ({
    sign: vi.fn(),
    verify: vi.fn(),
});
