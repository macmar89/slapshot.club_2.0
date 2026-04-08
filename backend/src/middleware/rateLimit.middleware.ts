import rateLimit from 'express-rate-limit';
import { IS_PRODUCTION } from '../config/env.js';

/**
 * Global API rate limiter — applied to all /api/v1/* routes.
 * 200 requests per 15 minutes per IP.
 */
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: IS_PRODUCTION ? 500 : 1000,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    status: 'fail',
    message: 'Too many requests, please try again later.',
  },
  skip: (req) => req.method === 'OPTIONS',
});

/**
 * Strict limiter for sensitive auth endpoints:
 * login, register, forgot-password, resend-verification.
 * 10 requests per 15 minutes per IP.
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: IS_PRODUCTION ? 10 : 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    status: 'fail',
    message: 'Too many authentication attempts, please try again later.',
  },
});

/**
 * Limiter for the token refresh endpoint.
 * 30 requests per 15 minutes per IP.
 */
export const refreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: IS_PRODUCTION ? 30 : 300,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    status: 'fail',
    message: 'Too many refresh attempts, please try again later.',
  },
});
