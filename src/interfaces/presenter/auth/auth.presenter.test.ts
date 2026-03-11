import { describe, expect, it } from 'vitest';

import { TokenResult } from '#/domain/services/token.service';
import { AuthPresenter } from '#/interfaces/presenter/auth/auth.presenter';

describe('AuthPresenter', () => {
    describe('toHTTP', () => {
        it('should map TokenResult to AuthResponse', () => {
            const tokenResult: TokenResult = {
                token: 'jwt-token-123',
                expiresIn: '1h',
            };

            const result = AuthPresenter.toHTTP(tokenResult);

            expect(result).toEqual({
                token: 'jwt-token-123',
                expiresIn: '1h',
            });
        });
    });
});
