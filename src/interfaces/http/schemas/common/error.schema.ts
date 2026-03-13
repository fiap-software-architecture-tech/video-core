import z from 'zod';

const baseErrorSchema = z.object({
    error: z.string().describe('Tipo de erro HTTP'),
    message: z.string().describe('Mensagem geral do erro'),
});

const validationDetailsSchema = z.object({
    details: z
        .array(
            z.object({
                field: z.string().describe('Campo que apresentou erro'),
                message: z.string().describe('Mensagem de erro para o campo'),
            }),
        )
        .optional()
        .describe('Lista de detalhes dos erros de validação'),
});

export const badRequestSchema = baseErrorSchema
    .extend({
        error: z.literal('Bad Request'),
    })
    .merge(validationDetailsSchema);

export const notFoundSchema = baseErrorSchema.extend({
    error: z.literal('Not Found'),
});

export const conflictErrorSchema = baseErrorSchema.extend({
    error: z.literal('Conflict'),
});

export const businessErrorSchema = baseErrorSchema.extend({
    error: z.literal('Business Error'),
});

export const unauthorizedErrorSchema = baseErrorSchema.extend({
    error: z.literal('Unauthorized'),
});

export const internalServerErrorSchema = baseErrorSchema.extend({
    error: z.literal('Internal Server Error'),
});

export type BadRequestError = z.infer<typeof badRequestSchema>;
export type NotFoundError = z.infer<typeof notFoundSchema>;
export type ConflictError = z.infer<typeof conflictErrorSchema>;
export type BusinessError = z.infer<typeof businessErrorSchema>;
export type UnauthorizedError = z.infer<typeof unauthorizedErrorSchema>;
export type InternalServerError = z.infer<typeof internalServerErrorSchema>;
