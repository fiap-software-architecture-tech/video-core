import { FastifyInstance } from 'fastify';
import { StatusCodes } from 'http-status-codes';

import { TYPES } from '#/infrastructure/config/di/types';

export const videoRoute = (app: FastifyInstance) => {
    const controller = app.container.get<VideoController>(TYPES.VideoController);

    app.post('/upload', {}, async (req, reply) => {
        const response = await controller.upload(req.body);
        return reply.status(StatusCodes.OK).send(response);
    });
};
