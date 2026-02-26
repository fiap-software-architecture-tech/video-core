import z from 'zod';

const messages = {
    email_required: 'Email is required',
    email_invalid: 'Invalid email format',
    password_required: 'Password is required',
    password_min: 'Password must be at least 6 characters',
};

export const registerRequestSchema = z.object({
    email: z.string({ required_error: messages.email_required }).email({ message: messages.email_invalid }),
    password: z.string({ required_error: messages.password_required }).min(6, { message: messages.password_min }),
});

export type RegisterRequest = z.infer<typeof registerRequestSchema>;
