import type { ConnectionOptions } from 'bullmq';
import { Redis } from 'ioredis';
import { logger } from '../utils/logger.js';

export const redisConfig: ConnectionOptions = {
  url: process.env.REDIS_URL!,
};

let redisClient: Redis | null = null;

export const getRedisClient = (): Redis => {
  if (!redisClient) {
    redisClient = new Redis(process.env.REDIS_URL!, {
      lazyConnect: true,
      maxRetriesPerRequest: 2,
      commandTimeout: 1000,
    });

    redisClient.on('error', (error: Error) => {
      logger.error({ error: error.message }, 'Redis client error');
    });
  }

  return redisClient;
};
