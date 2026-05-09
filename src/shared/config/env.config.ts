import { z } from 'zod';
import { envSchema } from './env.schema';

export const validateEnv = (config: Record<string, unknown>) => {
  const parsed = envSchema.safeParse(config);

  if (!parsed.success) {
    console.error(
      'Invalid environment configuration:',
      z.treeifyError(parsed.error),
    );
    throw new Error('Invalid environment configuration');
  }

  return parsed.data;
};
