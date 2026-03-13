import { Mocked } from 'vitest';
import { beforeEach, describe, expect, it } from 'vitest';

import { makeUser } from '#/__tests__/factories/user.factory';
import { createMockUserRepository } from '#/__tests__/mocks/repositories/mock-user.repository';
import { createMockHashService } from '#/__tests__/mocks/services/mock-hash.service';
import { createMockLogger } from '#/__tests__/mocks/services/mock-logger.service';
import { Register } from '#/application/use-cases/auth/register/register';
import { ConflictError } from '#/domain/errors';
import { IUserRepository } from '#/domain/repositories/user.repository';
import { IHashService } from '#/domain/services/hash.service';
import { ILogger } from '#/domain/services/logger.service';

describe('Register', () => {
    let sut: Register;
    let mockLogger: Mocked<ILogger>;
    let mockHashService: Mocked<IHashService>;
    let mockUserRepository: Mocked<IUserRepository>;

    beforeEach(() => {
        mockLogger = createMockLogger();
        mockHashService = createMockHashService();
        mockUserRepository = createMockUserRepository();

        sut = new Register(mockLogger, mockHashService, mockUserRepository);
    });

    it('should register a new user successfully', async () => {
        const request = { email: 'new@example.com', password: 'password123' };
        const hashedPassword = 'hashed-password-abc';
        const createdUser = makeUser({ email: request.email, password: hashedPassword });

        mockUserRepository.findByEmail.mockResolvedValue(null);
        mockHashService.hash.mockResolvedValue(hashedPassword);
        mockUserRepository.create.mockResolvedValue(createdUser);

        const result = await sut.execute(request);

        expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(request.email);
        expect(mockHashService.hash).toHaveBeenCalledWith(request.password);
        expect(mockUserRepository.create).toHaveBeenCalledWith(
            expect.objectContaining({ email: request.email, password: hashedPassword }),
        );
        expect(result).toBe(createdUser);
    });

    it('should throw ConflictError when user already exists', async () => {
        const request = { email: 'existing@example.com', password: 'password123' };
        const existingUser = makeUser({ email: request.email });

        mockUserRepository.findByEmail.mockResolvedValue(existingUser);

        await expect(sut.execute(request)).rejects.toThrow(ConflictError);
        expect(mockUserRepository.create).not.toHaveBeenCalled();
        expect(mockHashService.hash).not.toHaveBeenCalled();
    });
});
