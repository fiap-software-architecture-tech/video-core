import { PrismaClient } from '@prisma/client';
import { inject, injectable } from 'inversify';

import { User } from '#/domain/entities/user';
import { IUserRepository } from '#/domain/repositories/user.repository';
import { ILogger } from '#/domain/services/logger.service';
import { TYPES } from '#/infrastructure/config/di/types';
import { PrismaUserMapper } from '#/infrastructure/repositories/prisma/mappers/prisma-user.mapper';

@injectable()
export class PrismaUserRepository implements IUserRepository {
    constructor(
        @inject(TYPES.Logger) private readonly logger: ILogger,
        @inject(TYPES.PrismaClient) private readonly prisma: PrismaClient,
    ) {}

    async create(user: User): Promise<User> {
        try {
            this.logger.info('Creating user in database', { email: user.email });
            const data = await this.prisma.user.create({
                data: PrismaUserMapper.toCreate(user),
            });
            const result = PrismaUserMapper.toDomain(data);
            this.logger.info('User created in database', { userId: result.id });
            return result;
        } catch (error) {
            this.logger.error('Failed to create user in database', error as Error, { email: user.email });
            throw error;
        }
    }

    async findByEmail(email: string): Promise<User | null> {
        this.logger.debug('Finding user by email', { email });
        const data = await this.prisma.user.findFirst({
            where: { email },
        });
        if (!data) return null;
        return PrismaUserMapper.toDomain(data);
    }
}
