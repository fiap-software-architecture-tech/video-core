import { User } from '#/domain/entities/user';
import { UserResponse } from '#/interfaces/http/schemas/auth/auth-response.schema';

export class UserPresenter {
    static toHTTP(user: User): UserResponse {
        return {
            id: user.id,
            email: user.email,
        };
    }
}
