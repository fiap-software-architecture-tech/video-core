import jwt from 'jsonwebtoken';

import { User } from '#/domain/entities/user';
import { ITokenGeneratorService, TokenResult } from '#/domain/services/token-generator.service';
import { env } from '#/infrastructure/config/env';

const TIME_UNITS = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
} as const;

const DEFAULT_EXPIRATION_MS = 3600 * 1000;

export class JwtTokenGeneratorService implements ITokenGeneratorService {
    private readonly secret = env.JWT_SECRET ?? 'default_secret';
    private readonly expiresIn = '1h';

    sign(user: User): TokenResult {
        try {
            const token = jwt.sign({ id: user.id, email: user.email }, this.secret, { expiresIn: this.expiresIn });
            const expiresIn = new Date(Date.now() + this.parseExpiresIn(this.expiresIn)).toISOString();

            return { token, expiresIn };
        } catch (error) {
            console.error('Error generating token:', error);
            throw new Error('Failed to generate token');
        }
    }

    private parseExpiresIn(expiresIn: string): number {
        const match = expiresIn.match(/^(\d+)([smhd])$/);

        if (!match) {
            return DEFAULT_EXPIRATION_MS;
        }

        const value = parseInt(match[1], 10);
        const unit = match[2] as keyof typeof TIME_UNITS;

        return value * (TIME_UNITS[unit] ?? DEFAULT_EXPIRATION_MS);
    }
}
