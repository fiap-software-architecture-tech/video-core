import { inject, injectable } from 'inversify';

import { ILoginUseCase } from '#/application/use-cases/auth/login/login.use-case';
import { IRegisterUseCase } from '#/application/use-cases/auth/register/register.use-case';
import { ILogger } from '#/domain/services/logger.service';
import { TYPES } from '#/infrastructure/config/di/types';
import { AuthRequest } from '#/interfaces/http/schemas/auth/auth-request.schema';
import { AuthResponse, UserResponse } from '#/interfaces/http/schemas/auth/auth-response.schema';
import { AuthPresenter } from '#/interfaces/presenter/auth/auth.presenter';
import { UserPresenter } from '#/interfaces/presenter/auth/user.presenter';

@injectable()
export class AuthController {
    constructor(
        @inject(TYPES.Logger) private readonly logger: ILogger,
        @inject(TYPES.RegisterUseCase) private readonly registerUseCase: IRegisterUseCase,
        @inject(TYPES.LoginUseCase) private readonly loginUseCase: ILoginUseCase,
    ) {}

    async register(request: AuthRequest): Promise<UserResponse> {
        this.logger.info('Registering a new user', { email: request.email });
        const response = await this.registerUseCase.execute(request);
        console.log(response);
        return UserPresenter.toHTTP(response);
    }

    async login(request: AuthRequest): Promise<AuthResponse> {
        this.logger.info('Generating auth token for user', { email: request.email });
        const result = await this.loginUseCase.execute(request);
        return AuthPresenter.toHTTP(result);
    }
}
