import { Container } from 'inversify';

import { IHashService } from '#/domain/services/hash.service';
import { ILogger } from '#/domain/services/logger.service';
import { TYPES } from '#/infrastructure/config/di/types';
import { createPinoLogger } from '#/infrastructure/config/logger';
import { BcryptHashService } from '#/infrastructure/services/bcrypt/bcrypt-hash.service';
import { PinoLoggerService } from '#/infrastructure/services/pino-logger/pino-logger.service';

export function bindServices(container: Container) {
    container.bind<IHashService>(TYPES.HashService).to(BcryptHashService).inSingletonScope();

    container
        .bind<ILogger>(TYPES.Logger)
        .toDynamicValue(() => {
            return new PinoLoggerService(createPinoLogger());
        })
        .inRequestScope();
}
