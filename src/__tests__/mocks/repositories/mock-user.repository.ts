import { Mocked, vi } from 'vitest';

import { IUserRepository } from '#/domain/repositories/user.repository';

export const createMockUserRepository = (): Mocked<IUserRepository> => ({
    create: vi.fn(),
    findByEmail: vi.fn(),
});
