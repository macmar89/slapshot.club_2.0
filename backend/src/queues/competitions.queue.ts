import { Queue } from 'bullmq';
import { redisConfig } from '../config/redis.config.js';
import { logger } from '../utils/logger.js';

export const competitionsQueue = new Queue('competitions-queue', {
  connection: redisConfig,
  defaultJobOptions: {
    attempts: 5,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
    removeOnComplete: true,
    removeOnFail: 1000,
  },
});
