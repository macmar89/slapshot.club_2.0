export const IS_PRODUCTION = process.env.NODE_ENV === 'production';
export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
export const IS_TEST = process.env.NODE_ENV === 'test';

import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  // Basic
  PORT: z.coerce.number().default(4800),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  APP_SPORT: z.enum(['HOCKEY', 'FOOTBALL']),
  FRONTEND_URL: z.string(),

  //  Database & Redis
  DATABASE_URL: z.string(),
  REDIS_URL: z.string(),

  // Auth & Security
  JWT_ACCESS_SECRET: z.string().min(32, 'Access secret must be at least 32 characters long'),
  JWT_REFRESH_SECRET: z.string().min(32, 'Refresh secret must be at least 32 characters long'),
  JWT_ACCESS_EXPIRES_IN: z.string(),
  COOKIE_ACCESS_MAX_AGE: z.coerce.number(),
  REFRESH_TOKEN_EXPIRES_IN_MS: z.coerce.number(),

  // Business Logic & Config
  DEFAULT_USER_PLAN: z.enum(['free', 'starter', 'pro']),
  NEXT_PUBLIC_ENABLE_TURNSTILE: z.coerce.boolean().default(false),

  // Email (Brevo)
  BREVO_API_KEY: z.string().min(1, 'Brevo API key is required'),
  BREVO_SENDER_NAME: z.string().min(1, 'Brevo sender name is required'),
  BREVO_SENDER_EMAIL: z.email('Invalid Brevo sender email format'),
});

// Validation process
const envServer = envSchema.safeParse(process.env);

if (!envServer.success) {
  console.error('❌ Invalid environment variables:');

  // Formatted error output for easier debugging
  console.error(JSON.stringify(envServer.error.flatten().fieldErrors, null, 2));

  process.exit(1); // Force shutdown on configuration error
}

export const env = envServer.data;

// Extend the global process.env type
declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }
}
