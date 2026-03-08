import { FastifyInstance } from 'fastify';
import { StatusCodes } from 'http-status-codes';

import { TYPES } from '#/infrastructure/config/di/types';
import { VideoController } from '#/interfaces/controller/video.controller';
import { authMiddleware } from '#/interfaces/http/middlewares/auth.middleware';
import { VideoQueryRequest, videoUploadRequestSchema } from '#/interfaces/http/schemas/video/video-request.schema';
import { videoListSchema, videoUploadSchema } from '#/interfaces/http/schemas/video/video-route.schema';

export const videoRoute = (app: FastifyInstance) => {
    const controller = app.container.get<VideoController>(TYPES.VideoController);

    app.addHook('onRequest', authMiddleware);

    app.post('/upload', videoUploadSchema, async (req, reply) => {
        const file = await req.file();

        if (!file) {
            return reply.status(StatusCodes.BAD_REQUEST).send({ error: 'File is required' });
        }

        const { id: userId } = req.user as { id: string };

        const dto = videoUploadRequestSchema.parse({
            userId,
            fileName: file.filename,
            mimetype: file.mimetype,
            fileSize: file.file.bytesRead,
            stream: file.file,
        });

        const response = await controller.upload(dto);
        return reply.status(StatusCodes.OK).send(response);
    });

    app.get<{ Querystring: VideoQueryRequest }>('/', videoListSchema, async (req, reply) => {
        const { id: userId } = req.user as { id: string };
        const query = { ...req.query, userId };
        const videos = await controller.list(query);
        return reply.status(StatusCodes.OK).send(videos);
    });
};
