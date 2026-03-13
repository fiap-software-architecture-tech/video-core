import { User, UserPayload } from '#/domain/entities/user';

export const makeUser = (overrides?: Partial<UserPayload>): User =>
    new User({
        id: 'user-id-1',
        email: 'test@example.com',
        password: 'hashed-password',
        ...overrides,
    });
