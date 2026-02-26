import { PrismaClient } from '@prisma/client';
import { Container } from 'inversify';

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

bindServices(container);

export { container };
