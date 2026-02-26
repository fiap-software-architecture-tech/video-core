import { Prisma, User as PrismaUser } from '@prisma/client';

import { User, UserPayload } from '#/domain/entities/user';

export class PrismaUserMapper {
    static toDomain(data: PrismaUser): User {
        return new User({
            id: data.id,
            email: data.email,
            password: data.password,
        } as UserPayload);
    }

    static toCreate(data: User): Prisma.UserCreateInput {
        return {
            email: data.email,
            password: data.password,
        };
    }
}
