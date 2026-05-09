import { z } from 'zod';

export const envSchema = z.object({
  PORT: z.coerce.number().optional().default(3000),
  DATABASE_URL: z.string().url('A DATABASE_URL deve ser uma URL válida'),
  JWT_SECRET: z.string().min(1, 'JWT_SECRET é obrigatório'),
});

export type Env = z.infer<typeof envSchema>;
