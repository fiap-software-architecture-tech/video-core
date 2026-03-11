import { vi } from 'vitest';

export const createMockPrismaClient = () => ({
    user: {
        create: vi.fn(),
        findFirst: vi.fn(),
    },
    job: {
        create: vi.fn(),
        findMany: vi.fn(),
        update: vi.fn(),
        findUnique: vi.fn(),
    },
});

export type MockPrismaClient = ReturnType<typeof createMockPrismaClient>;
