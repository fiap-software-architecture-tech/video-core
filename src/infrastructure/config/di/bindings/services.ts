import { Container } from 'inversify';

import { IHashService } from '#/domain/services/hash.service';
import { ILogger } from '#/domain/services/logger.service';
import { ITokenService } from '#/domain/services/token.service';
import { TYPES } from '#/infrastructure/config/di/types';
import { createPinoLogger } from '#/infrastructure/config/logger';
import { BcryptHashService } from '#/infrastructure/services/bcrypt/bcrypt-hash.service';
import { JwtTokenService } from '#/infrastructure/services/jwt/jwt-token.service';
import { PinoLoggerService } from '#/infrastructure/services/pino-logger/pino-logger.service';

export function bindServices(container: Container) {
    container.bind<IHashService>(TYPES.HashService).to(BcryptHashService).inSingletonScope();
    container.bind<ITokenService>(TYPES.TokenService).to(JwtTokenService).inSingletonScope();

    container
        .bind<ILogger>(TYPES.Logger)
        .toDynamicValue(() => {
            return new PinoLoggerService(createPinoLogger());
        })
        .inRequestScope();
}
