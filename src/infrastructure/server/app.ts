import fastify, { FastifyInstance } from 'fastify';
import { Container } from 'inversify';

export function buildApp(container: Container): FastifyInstance {
    const app = fastify({ logger: true });

    app.decorate('container', container);

    return app;
}
