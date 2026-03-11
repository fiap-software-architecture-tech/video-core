import { describe, expect, it } from 'vitest';

import { makeUser } from '#/__tests__/factories/user.factory';
import { UserPresenter } from '#/interfaces/presenter/auth/user.presenter';

describe('UserPresenter', () => {
    describe('toHTTP', () => {
        it('should map User to UserResponse with id and email only', () => {
            const user = makeUser({ id: 'abc-123', email: 'john@example.com', password: 'secret' });

            const result = UserPresenter.toHTTP(user);

            expect(result).toEqual({
                id: 'abc-123',
                email: 'john@example.com',
            });
            expect(result).not.toHaveProperty('password');
        });
    });
});
