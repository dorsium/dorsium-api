import { config } from 'dotenv';
import { z } from 'zod';

config();

const envSchema = z.object({
  PORT: z.string().default('3000'),
  INTERNAL_SERVICE_URL: z.string().url().default('http://localhost:4000'),
  JWT_SECRET: z.string().default('secret'),
  SUPABASE_URL: z.string().url().default('http://localhost:54321'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().default('supabase-key'),
  RATE_LIMIT_MAX: z.string().default('100'),
  RATE_LIMIT_TIME_WINDOW: z.string().default('60000')
});

export const env = envSchema.parse(process.env);
