import { User } from '#/domain/entities/user';
import { AuthRequest } from '#/interfaces/http/schemas/auth/auth-request.schema';

export interface IRegisterUseCase {
    execute(request: AuthRequest): Promise<User>;
}
