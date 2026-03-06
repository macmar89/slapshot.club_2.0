import { Queue } from 'bullmq';
import { redisConfig } from '../config/redis.config.js';

export const emailQueue = new Queue('email-queue', {
  connection: redisConfig,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
    removeOnComplete: true,
    removeOnFail: 1000,
  },
});
