export const videoUploadSchema = {
    schema: {
        tags: ['Video'],
        summary: 'Upload de um arquivo de vídeo',
        consumes: ['multipart/form-data'],
        body: {
            type: 'object',
            properties: {
                file: { type: 'string', format: 'binary' },
            },
            required: ['file'],
        },
        // response: {
        //     200: videoUploadResponseSchema,
        //     400: badRequestSchema,
        //     401: unauthorizedSchema,
        // },
    },
};
