import fastifyCors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import fastifyMultipart from '@fastify/multipart';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import fastify, { FastifyInstance } from 'fastify';
import { jsonSchemaTransform, serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import { Container } from 'inversify';

import { env } from '#/infrastructure/config/env';
import { errorHandler } from '#/interfaces/http/middlewares/error-handler.middleware';
import { registerRoutes } from '#/interfaces/http/routes';

export function buildApp(container: Container): FastifyInstance {
    const app = fastify({ logger: true });

    app.decorate('container', container);

    app.setSerializerCompiler(serializerCompiler);
    app.setValidatorCompiler(validatorCompiler);

    app.register(fastifyCors);
    app.register(fastifyMultipart, {
        limits: { fileSize: 500 * 1024 * 1024, files: 1 },
    });
    app.register(fastifyJwt, {
        secret: env.JWT_SECRET,
        sign: { expiresIn: env.JWT_EXPIRES_IN },
    });

    app.register(fastifySwagger, {
        openapi: {
            info: {
                title: 'API Video Core',
                description: 'Documentação da API Video Core',
                version: '1.0.0',
            },
            tags: [
                {
                    name: 'Auth',
                    description: 'Endpoints para autenticação e criação de usuários',
                },
            ],
        },
        transform: jsonSchemaTransform,
    });

    app.register(fastifySwaggerUi, {
        routePrefix: '/docs',
    });

    registerRoutes(app);

    app.setErrorHandler(errorHandler);

    return app;
}
