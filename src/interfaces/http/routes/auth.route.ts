import { FastifyInstance } from 'fastify';
import { StatusCodes } from 'http-status-codes';

import { TYPES } from '#/infrastructure/config/di/types';
import { AuthController } from '#/interfaces/controller/auth.controller';
import { AuthRequest } from '#/interfaces/http/schemas/auth/auth-request.schema';
import { loginSchema, registerSchema } from '#/interfaces/http/schemas/auth/auth-route.schema';

export const authRoute = (app: FastifyInstance) => {
    const controller = app.container.get<AuthController>(TYPES.AuthController);

    app.post<{ Body: AuthRequest }>('/register', registerSchema, async (req, reply) => {
        const response = await controller.register(req.body);
        return reply.status(StatusCodes.CREATED).send(response);
    });

    app.post<{ Body: AuthRequest }>('/login', loginSchema, async (req, reply) => {
        const response = await controller.login(req.body);
        return reply.status(StatusCodes.OK).send(response);
    });
};
