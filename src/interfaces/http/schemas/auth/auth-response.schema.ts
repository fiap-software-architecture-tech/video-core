import z from 'zod';

export const authResponseSchema = z.object({
    id: z.string().uuid(),
    email: z.string().email(),
});

export type AuthResponse = z.infer<typeof authResponseSchema>;
