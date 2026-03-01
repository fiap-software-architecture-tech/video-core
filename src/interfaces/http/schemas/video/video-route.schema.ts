import z from 'zod';

import { badRequestSchema, unauthorizedErrorSchema } from '#/interfaces/http/schemas/common/error.schema';
import { videoQueryRequestSchema } from '#/interfaces/http/schemas/video/video-request.schema';
import { videoResponseSchema } from '#/interfaces/http/schemas/video/video-response.schema';

export const videoUploadSchema = {
    schema: {
        tags: ['Video'],
        summary: 'Upload de um arquivo de vídeo',
        consumes: ['multipart/form-data'],
        response: {
            200: videoResponseSchema,
            400: badRequestSchema,
            401: unauthorizedErrorSchema,
        },
    },
};

export const videoListSchema = {
    schema: {
        tags: ['Video'],
        summary: 'Listagem de vídeos',
        query: videoQueryRequestSchema,
        response: {
            200: z.array(videoResponseSchema),
        },
    },
};
