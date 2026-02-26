import { authRequestSchema } from '#/interfaces/http/schemas/auth/auth-request.schema';
import { authResponseSchema } from '#/interfaces/http/schemas/auth/auth-response.schema';
import { badRequestSchema, conflictErrorSchema } from '#/interfaces/http/schemas/common/error.schema';

export const registerSchema = {
    schema: {
        tags: ['Auth'],
        summary: 'Registrar usuário',
        body: authRequestSchema,
        response: {
            201: authResponseSchema,
            400: badRequestSchema,
            409: conflictErrorSchema,
        },
    },
};
