import { Mocked } from 'vitest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { makeUser } from '#/__tests__/factories/user.factory';
import { createMockLogger } from '#/__tests__/mocks/services/mock-logger.service';
import { ILoginUseCase } from '#/application/use-cases/auth/login/login.use-case';
import { IRegisterUseCase } from '#/application/use-cases/auth/register/register.use-case';
import { ConflictError, NotFoundError } from '#/domain/errors';
import { ILogger } from '#/domain/services/logger.service';
import { TokenResult } from '#/domain/services/token.service';
import { AuthController } from '#/interfaces/controller/auth.controller';

describe('AuthController', () => {
    let sut: AuthController;
    let mockLogger: Mocked<ILogger>;
    let mockRegisterUseCase: { execute: ReturnType<typeof vi.fn> };
    let mockLoginUseCase: { execute: ReturnType<typeof vi.fn> };

    beforeEach(() => {
        mockLogger = createMockLogger();
        mockRegisterUseCase = { execute: vi.fn() };
        mockLoginUseCase = { execute: vi.fn() };

        sut = new AuthController(
            mockLogger,
            mockRegisterUseCase as IRegisterUseCase,
            mockLoginUseCase as ILoginUseCase,
        );
    });

    describe('register', () => {
        it('should call registerUseCase and return UserPresenter output', async () => {
            const request = { email: 'new@example.com', password: 'password123' };
            const user = makeUser({ email: request.email });

            mockRegisterUseCase.execute.mockResolvedValue(user);

            const result = await sut.register(request);

            expect(mockRegisterUseCase.execute).toHaveBeenCalledWith(request);
            expect(result).toEqual({
                id: user.id,
                email: user.email,
            });
            expect(result).not.toHaveProperty('password');
        });

        it('should propagate use case errors', async () => {
            const request = { email: 'existing@example.com', password: 'password123' };

            mockRegisterUseCase.execute.mockRejectedValue(new ConflictError('User already exists'));

            await expect(sut.register(request)).rejects.toThrow(ConflictError);
        });
    });

    describe('login', () => {
        it('should call loginUseCase and return AuthPresenter output', async () => {
            const request = { email: 'user@example.com', password: 'password123' };
            const tokenResult: TokenResult = { token: 'jwt-abc', expiresIn: '1h' };

            mockLoginUseCase.execute.mockResolvedValue(tokenResult);

            const result = await sut.login(request);

            expect(mockLoginUseCase.execute).toHaveBeenCalledWith(request);
            expect(result).toEqual({
                token: 'jwt-abc',
                expiresIn: '1h',
            });
        });

        it('should propagate use case errors', async () => {
            const request = { email: 'missing@example.com', password: 'password123' };

            mockLoginUseCase.execute.mockRejectedValue(new NotFoundError('User not found'));

            await expect(sut.login(request)).rejects.toThrow(NotFoundError);
        });
    });
});
