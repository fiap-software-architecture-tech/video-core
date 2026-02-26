import { Container } from 'inversify';

declare module 'fastify' {
    interface FastifyInstance {
        container: Container;
    }
}
