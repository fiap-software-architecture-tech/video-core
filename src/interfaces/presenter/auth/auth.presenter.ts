import { User } from '#/domain/entities/user';
import { AuthResponse } from '#/interfaces/http/schemas/auth/auth-response.schema';

export class AuthPresenter {
    static toHTTP(user: User): AuthResponse {
        return {
            id: user.id,
            email: user.email,
        };
    }
}
