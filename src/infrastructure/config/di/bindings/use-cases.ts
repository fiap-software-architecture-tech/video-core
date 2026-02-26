import { Container } from 'inversify';

import { Login } from '#/application/use-cases/auth/login/login';
import { ILoginUseCase } from '#/application/use-cases/auth/login/login.use-case';
import { Register } from '#/application/use-cases/auth/register/register';
import { IRegisterUseCase } from '#/application/use-cases/auth/register/register.use-case';
import { TYPES } from '#/infrastructure/config/di/types';

export function bindUseCases(container: Container) {
    container.bind<IRegisterUseCase>(TYPES.RegisterUseCase).to(Register).inTransientScope();
    container.bind<ILoginUseCase>(TYPES.LoginUseCase).to(Login).inTransientScope();
}
