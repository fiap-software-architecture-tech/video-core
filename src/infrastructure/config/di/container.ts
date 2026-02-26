import { PrismaClient } from '@prisma/client';
import { Container } from 'inversify';

import { bindRepositories } from '#/infrastructure/config/di/bindings/repositories';
import { bindServices } from '#/infrastructure/config/di/bindings/services';
import { TYPES } from '#/infrastructure/config/di/types';

const container = new Container();

container
    .bind<PrismaClient>(TYPES.PrismaClient)
    .toDynamicValue(() => {
        return new PrismaClient({
            log: ['error'],
        });
    })
    .inSingletonScope();

bindRepositories(container);
bindServices(container);

export { container };
