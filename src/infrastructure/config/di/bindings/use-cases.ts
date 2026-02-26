import { Container } from 'inversify';

import { Register } from '#/application/use-cases/auth/register/register';
import { IRegisterUseCase } from '#/application/use-cases/auth/register/register.use-case';
import { TYPES } from '#/infrastructure/config/di/types';

export function bindUseCases(container: Container) {
    container.bind<IRegisterUseCase>(TYPES.RegisterUseCase).to(Register).inTransientScope();
}
