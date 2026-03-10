import { describe, expect, it } from 'vitest';

import { User } from '#/domain/entities/user';
import { PrismaUserMapper } from '#/infrastructure/repositories/prisma/mappers/prisma-user.mapper';

describe('PrismaUserMapper', () => {
    const prismaUser = {
        id: 'user-id-1',
        email: 'test@example.com',
        password: 'hashed-pwd',
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    describe('toDomain', () => {
        it('should map a Prisma user to a domain User entity', () => {
            const result = PrismaUserMapper.toDomain(prismaUser);

            expect(result).toBeInstanceOf(User);
            expect(result.id).toBe('user-id-1');
            expect(result.email).toBe('test@example.com');
            expect(result.password).toBe('hashed-pwd');
        });
    });

    describe('toCreate', () => {
        it('should map a domain User to Prisma create input', () => {
            const user = new User({ id: 'user-id-1', email: 'test@example.com', password: 'hashed-pwd' });

            const result = PrismaUserMapper.toCreate(user);

            expect(result).toEqual({
                email: 'test@example.com',
                password: 'hashed-pwd',
            });
            expect(result).not.toHaveProperty('id');
        });
    });
});
