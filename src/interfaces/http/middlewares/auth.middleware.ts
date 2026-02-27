import { FastifyReply, FastifyRequest } from 'fastify';

import { UnauthorizedError } from '#/domain/errors';

export async function authMiddleware(req: FastifyRequest, _reply: FastifyReply): Promise<void> {
    try {
        await req.jwtVerify();
    } catch {
        throw new UnauthorizedError('Invalid or missing authentication token');
    }
}
