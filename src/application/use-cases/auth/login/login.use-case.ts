import { TokenResult } from '#/domain/services/token.service';
import { AuthRequest } from '#/interfaces/http/schemas/auth/auth-request.schema';

export interface ILoginUseCase {
    execute(request: AuthRequest): Promise<TokenResult>;
}
