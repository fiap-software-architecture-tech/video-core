import z from 'zod';

export const videoResponseSchema = z.object({
    id: z.string(),
    originalFileName: z.string(),
    originalVideoKey: z.string(),
    status: z.string(),
    zipKey: z.string().nullable(),
    frameCount: z.number().nullable(),
    errorMessage: z.string().nullable(),
    user: z.object({
        id: z.string().uuid(),
        email: z.string(),
    }),
});

export type VideoResponse = z.infer<typeof videoResponseSchema>;
