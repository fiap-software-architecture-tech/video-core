import { z } from 'zod';

const envSchema = z.object({
    NODE_ENV: z.enum(['dev', 'hml', 'prd']).default('dev'),
    PORT: z.coerce.number().default(3000),
});

export const env = envSchema.parse(process.env);
