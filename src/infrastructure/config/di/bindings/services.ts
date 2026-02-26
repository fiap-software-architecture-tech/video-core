import { Container } from 'inversify';

import { IHashService } from '#/domain/services/hash.service';
import { ILogger } from '#/domain/services/logger.service';
import { ITokenGeneratorService } from '#/domain/services/token-generator.service';
import { TYPES } from '#/infrastructure/config/di/types';
import { createPinoLogger } from '#/infrastructure/config/logger';
import { BcryptHashService } from '#/infrastructure/services/bcrypt/bcrypt-hash.service';
import { JwtTokenGeneratorService } from '#/infrastructure/services/jwt/jwt-token-generator.service';
import { PinoLoggerService } from '#/infrastructure/services/pino-logger/pino-logger.service';

export function bindServices(container: Container) {
    container.bind<IHashService>(TYPES.HashService).to(BcryptHashService).inSingletonScope();
    container.bind<ITokenGeneratorService>(TYPES.TokenGeneratorService).to(JwtTokenGeneratorService).inSingletonScope();

    container
        .bind<ILogger>(TYPES.Logger)
        .toDynamicValue(() => {
            return new PinoLoggerService(createPinoLogger());
        })
        .inRequestScope();
}
