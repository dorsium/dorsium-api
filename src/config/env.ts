import { config } from 'dotenv';
import { z } from 'zod';

config();

const envSchema = z.object({
  PORT: z.string().default('3000'),
  INTERNAL_SERVICE_URL: z.string().url().default('http://localhost:4000'),
  JWT_SECRET: z.string().default('secret')
});

export const env = envSchema.parse(process.env);
