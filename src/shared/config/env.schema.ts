import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().optional().default(3000),
  DATABASE_URL: z.string().url('The DATABASE_URL must be a valid URL'),
  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
});

export type Env = z.infer<typeof envSchema>;
