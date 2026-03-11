import { Mocked } from 'vitest';
import { beforeEach, describe, expect, it } from 'vitest';

import { makeUser } from '#/__tests__/factories/user.factory';
import { createMockUserRepository } from '#/__tests__/mocks/repositories/mock-user.repository';
import { createMockHashService } from '#/__tests__/mocks/services/mock-hash.service';
import { createMockLogger } from '#/__tests__/mocks/services/mock-logger.service';
import { createMockTokenService } from '#/__tests__/mocks/services/mock-token.service';
import { Login } from '#/application/use-cases/auth/login/login';
import { NotFoundError, UnauthorizedError } from '#/domain/errors';
import { IUserRepository } from '#/domain/repositories/user.repository';
import { IHashService } from '#/domain/services/hash.service';
import { ILogger } from '#/domain/services/logger.service';
import { ITokenService, TokenResult } from '#/domain/services/token.service';

describe('Login', () => {
    let sut: Login;
    let mockLogger: Mocked<ILogger>;
    let mockHashService: Mocked<IHashService>;
    let mockUserRepository: Mocked<IUserRepository>;
    let mockTokenService: Mocked<ITokenService>;

    beforeEach(() => {
        mockLogger = createMockLogger();
        mockHashService = createMockHashService();
        mockUserRepository = createMockUserRepository();
        mockTokenService = createMockTokenService();

        sut = new Login(mockLogger, mockHashService, mockUserRepository, mockTokenService);
    });

    it('should authenticate and return token', async () => {
        const request = { email: 'user@example.com', password: 'password123' };
        const user = makeUser({ email: request.email });
        const tokenResult: TokenResult = { token: 'jwt-token-123', expiresIn: '1h' };

        mockUserRepository.findByEmail.mockResolvedValue(user);
        mockHashService.compare.mockResolvedValue(true);
        mockTokenService.sign.mockReturnValue(tokenResult);

        const result = await sut.execute(request);

        expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(request.email);
        expect(mockHashService.compare).toHaveBeenCalledWith(request.password, user.password);
        expect(mockTokenService.sign).toHaveBeenCalledWith(user);
        expect(result).toBe(tokenResult);
    });

    it('should throw NotFoundError when user does not exist', async () => {
        const request = { email: 'missing@example.com', password: 'password123' };

        mockUserRepository.findByEmail.mockResolvedValue(null);

        await expect(sut.execute(request)).rejects.toThrow(NotFoundError);
        expect(mockHashService.compare).not.toHaveBeenCalled();
        expect(mockTokenService.sign).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedError when password is wrong', async () => {
        const request = { email: 'user@example.com', password: 'wrong-password' };
        const user = makeUser({ email: request.email });

        mockUserRepository.findByEmail.mockResolvedValue(user);
        mockHashService.compare.mockResolvedValue(false);

        await expect(sut.execute(request)).rejects.toThrow(UnauthorizedError);
        expect(mockTokenService.sign).not.toHaveBeenCalled();
    });
});
