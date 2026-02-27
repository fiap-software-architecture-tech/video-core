import jwt from 'jsonwebtoken';

import { User } from '#/domain/entities/user';
import { UnauthorizedError } from '#/domain/errors';
import { ITokenService, TokenResult } from '#/domain/services/token.service';
import { env } from '#/infrastructure/config/env';

const TIME_UNITS = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
} as const;

const DEFAULT_EXPIRATION = '1h';
const DEFAULT_EXPIRATION_MS = 3600 * 1000;

export class JwtTokenService implements ITokenService {
    private readonly secret: string;
    private readonly expiresIn: string;

    constructor() {
        this.secret = env.JWT_SECRET ?? 'default_secret';
        this.expiresIn = DEFAULT_EXPIRATION;
    }

    sign({ id, email }: User): TokenResult {
        const payload = { id, email };
        const token = jwt.sign(payload, this.secret, { expiresIn: this.expiresIn as jwt.SignOptions['expiresIn'] });
        const expiresIn = this.calculateExpirationDate(this.expiresIn);

        return { token, expiresIn };
    }

    verify(token: string): jwt.JwtPayload {
        try {
            const decoded = jwt.verify(token, this.secret);

            if (typeof decoded === 'string') {
                throw new UnauthorizedError('Invalid token payload');
            }

            return decoded;
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                throw new UnauthorizedError('Token has expired');
            }

            if (error instanceof jwt.JsonWebTokenError) {
                throw new UnauthorizedError('Invalid token');
            }

            throw new UnauthorizedError('Failed to verify token');
        }
    }

    private calculateExpirationDate(expiresIn: string): string {
        const expirationMs = this.parseExpiresInToMs(expiresIn);
        return new Date(Date.now() + expirationMs).toISOString();
    }

    private parseExpiresInToMs(expiresIn: string): number {
        const match = expiresIn.match(/^(\d+)([smhd])$/);

        if (!match) {
            return DEFAULT_EXPIRATION_MS;
        }

        const value = parseInt(match[1], 10);
        const unit = match[2] as keyof typeof TIME_UNITS;

        return value * (TIME_UNITS[unit] ?? DEFAULT_EXPIRATION_MS);
    }
}
