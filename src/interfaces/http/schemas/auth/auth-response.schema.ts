import z from 'zod';

export const authResponseSchema = z.object({
    token: z.string().describe('Token do cliente'),
    expiresIn: z.string().describe('Data de expiração do token'),
});

export const userResponseSchema = z.object({
    id: z.string().uuid(),
    email: z.string().email(),
});

export type AuthResponse = z.infer<typeof authResponseSchema>;
export type UserResponse = z.infer<typeof userResponseSchema>;
