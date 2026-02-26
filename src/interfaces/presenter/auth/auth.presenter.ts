import { TokenResult } from '#/domain/services/token-generator.service';
import { AuthResponse } from '#/interfaces/http/schemas/auth/auth-response.schema';

export class AuthPresenter {
    static toHTTP(data: TokenResult): AuthResponse {
        return {
            token: data.token,
            expiresIn: data.expiresIn,
        };
    }
}
