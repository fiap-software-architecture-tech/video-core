import z from 'zod';

export const userResponseSchema = z.object({
    id: z.string().uuid(),
    email: z.string().email(),
});

export type UserResponse = z.infer<typeof userResponseSchema>;
