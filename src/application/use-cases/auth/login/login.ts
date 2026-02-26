import { inject } from 'inversify';

import { ILoginUseCase } from '#/application/use-cases/auth/login/login.use-case';
import { NotFoundError, UnauthorizedError } from '#/domain/errors';
import { IUserRepository } from '#/domain/repositories/user.repository';
import { IHashService } from '#/domain/services/hash.service';
import { ILogger } from '#/domain/services/logger.service';
import { ITokenGeneratorService, TokenResult } from '#/domain/services/token-generator.service';
import { TYPES } from '#/infrastructure/config/di/types';
import { AuthRequest } from '#/interfaces/http/schemas/auth/auth-request.schema';

export class Login implements ILoginUseCase {
    constructor(
        @inject(TYPES.Logger) private readonly logger: ILogger,
        @inject(TYPES.HashService) private readonly hashService: IHashService,
        @inject(TYPES.UserRepository) private readonly userRepository: IUserRepository,
        @inject(TYPES.TokenGeneratorService) private readonly tokenGeneratorService: ITokenGeneratorService,
    ) {}

    async execute(request: AuthRequest): Promise<TokenResult> {
        this.logger.info('Starting authentication', { email: request.email });

        const user = await this.userRepository.findByEmail(request.email);
        if (!user) {
            this.logger.info('User not found during authentication', { email: request.email });
            throw new NotFoundError('User not found');
        }

        const verifyPassword = await this.hashService.compare(request.password, user.password);
        if (!verifyPassword) {
            this.logger.info('Invalid password attempt', { email: request.email });
            throw new UnauthorizedError('Password is wrong');
        }

        this.logger.info('User authenticated successfully', { userId: user.id, email: user.email });
        const result = this.tokenGeneratorService.sign(user);

        return result;
    }
}
