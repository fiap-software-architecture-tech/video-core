import bcrypt from 'bcryptjs';
import { inject, injectable } from 'inversify';

import { IHashService } from '#/domain/services/hash.service';
import { ILogger } from '#/domain/services/logger.service';
import { TYPES } from '#/infrastructure/config/di/types';

@injectable()
export class BcryptHashService implements IHashService {
    constructor(@inject(TYPES.Logger) private readonly logger: ILogger) {}

    async hash(value: string): Promise<string> {
        this.logger.info('Hashing value');
        return bcrypt.hash(value, 10);
    }

    async compare(value: string, hash: string): Promise<boolean> {
        this.logger.info('Comparing value with hash');
        return bcrypt.compare(value, hash);
    }
}
