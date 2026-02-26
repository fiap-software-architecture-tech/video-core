import { inject, injectable } from 'inversify';

import { IRegisterUseCase } from '#/application/use-cases/auth/register/register.use-case';
import { ILogger } from '#/domain/services/logger.service';
import { TYPES } from '#/infrastructure/config/di/types';
import { RegisterRequest } from '#/interfaces/http/schemas/user/user-request.schema';
import { UserResponse } from '#/interfaces/http/schemas/user/user-response.schema';
import { UserPresenter } from '#/interfaces/presenter/user/user.presenter';

@injectable()
export class AuthController {
    constructor(
        @inject(TYPES.Logger) private readonly logger: ILogger,
        @inject(TYPES.RegisterUseCase) private readonly registerUseCase: IRegisterUseCase,
    ) {}

    async register(request: RegisterRequest): Promise<UserResponse> {
        this.logger.info('Registering a new user', { email: request.email });
        const response = await this.registerUseCase.execute(request);
        return UserPresenter.toHTTP(response);
    }
}
