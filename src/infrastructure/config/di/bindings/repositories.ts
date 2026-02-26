import { Container } from 'inversify';

import { TYPES } from '#/infrastructure/config/di/types';
import { PrismaUserRepository } from '#/infrastructure/repositories/prisma/prisma-user.repository';

export function bindRepositories(container: Container) {
    container.bind(TYPES.UserRepository).to(PrismaUserRepository).inSingletonScope();
}
