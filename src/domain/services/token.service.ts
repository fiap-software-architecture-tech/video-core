import { JwtPayload } from 'jsonwebtoken';

import { User } from '#/domain/entities/user';

export interface TokenResult {
    token: string;
    expiresIn: string;
}

export interface ITokenService {
    sign(user: User): TokenResult;
    verify(token: string): JwtPayload;
}
