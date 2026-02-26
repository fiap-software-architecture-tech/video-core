import { User } from '#/domain/entities/user';

export interface TokenResult {
    token: string;
    expiresIn: string;
}

export interface ITokenGeneratorService {
    sign(user: User): TokenResult;
}
