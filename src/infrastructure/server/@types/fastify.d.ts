import { Container } from 'inversify';

declare module 'fastify' {
    interface FastifyInstance {
        container: Container;
    }
}

declare module '@fastify/jwt' {
    interface FastifyJWT {
        payload: { id: string; email: string };
        user: { id: string; email: string };
    }
}
