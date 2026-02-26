import { User } from '#/domain/entities/user';
import { RegisterRequest } from '#/interfaces/http/schemas/auth/auth-request.schema';

export interface IRegisterUseCase {
    execute(request: RegisterRequest): Promise<User>;
}
