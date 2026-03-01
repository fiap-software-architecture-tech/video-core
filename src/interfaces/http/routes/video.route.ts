import { FastifyInstance } from 'fastify';
import { StatusCodes } from 'http-status-codes';

import { TYPES } from '#/infrastructure/config/di/types';
import { VideoController } from '#/interfaces/controller/video.controller';
import { authMiddleware } from '#/interfaces/http/middlewares/auth.middleware';
import { videoUploadRequestSchema } from '#/interfaces/http/schemas/video/video-request.schema';

export const videoRoute = (app: FastifyInstance) => {
    const controller = app.container.get<VideoController>(TYPES.VideoController);

    app.addHook('onRequest', authMiddleware);

    app.post('/upload', async (req, reply) => {
        const file = await req.file();

        if (!file) {
            return reply.status(StatusCodes.BAD_REQUEST).send({ error: 'File is required' });
        }

        const dto = videoUploadRequestSchema.parse({
            fileName: file.filename,
            mimetype: file.mimetype,
            fileSize: file.file.bytesRead,
            stream: file.file,
        });

        const response = await controller.upload(dto);
        return reply.status(StatusCodes.OK).send(response);
    });
};
