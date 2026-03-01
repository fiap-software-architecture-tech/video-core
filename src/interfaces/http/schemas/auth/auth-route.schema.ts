import { authRequestSchema } from '#/interfaces/http/schemas/auth/auth-request.schema';
import { authResponseSchema, userResponseSchema } from '#/interfaces/http/schemas/auth/auth-response.schema';
import {
    badRequestSchema,
    conflictErrorSchema,
    unauthorizedErrorSchema,
} from '#/interfaces/http/schemas/common/error.schema';

export const registerSchema = {
    schema: {
        tags: ['Auth'],
        summary: 'Registrar usuário',
        body: authRequestSchema,
        response: {
            201: userResponseSchema,
            400: badRequestSchema,
            409: conflictErrorSchema,
        },
    },
};

export const loginSchema = {
    schema: {
        tags: ['Auth'],
        summary: 'Gerar token de autenticação',
        body: authRequestSchema,
        response: {
            200: authResponseSchema,
            400: badRequestSchema,
            401: unauthorizedErrorSchema,
        },
    },
};
