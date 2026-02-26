import { inject, injectable } from 'inversify';

import { IRegisterUseCase } from '#/application/use-cases/auth/register/register.use-case';
import { ILogger } from '#/domain/services/logger.service';
import { TYPES } from '#/infrastructure/config/di/types';
import { AuthRequest } from '#/interfaces/http/schemas/auth/auth-request.schema';
import { AuthResponse } from '#/interfaces/http/schemas/auth/auth-response.schema';
import { AuthPresenter } from '#/interfaces/presenter/auth/auth.presenter';

@injectable()
export class AuthController {
    constructor(
        @inject(TYPES.Logger) private readonly logger: ILogger,
        @inject(TYPES.RegisterUseCase) private readonly registerUseCase: IRegisterUseCase,
    ) {}

    async register(request: AuthRequest): Promise<AuthResponse> {
        this.logger.info('Registering a new user', { email: request.email });
        const response = await this.registerUseCase.execute(request);
        return AuthPresenter.toHTTP(response);
    }
}
