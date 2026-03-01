import { Container } from 'inversify';

import { IJobRepository } from '#/domain/repositories/job.repository';
import { IUserRepository } from '#/domain/repositories/user.repository';
import { TYPES } from '#/infrastructure/config/di/types';
import { PrismaJobRepository } from '#/infrastructure/repositories/prisma/prisma-job.repository';
import { PrismaUserRepository } from '#/infrastructure/repositories/prisma/prisma-user.repository';

export function bindRepositories(container: Container) {
    container.bind<IUserRepository>(TYPES.UserRepository).to(PrismaUserRepository).inSingletonScope();
    container.bind<IJobRepository>(TYPES.JobRepository).to(PrismaJobRepository).inSingletonScope();
}
