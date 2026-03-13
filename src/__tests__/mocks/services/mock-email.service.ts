import { Mocked, vi } from 'vitest';

import { IEmailService } from '#/domain/services/email.service';

export const createMockEmailService = (): Mocked<IEmailService> => ({
    send: vi.fn(),
});
