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

export const scheduleDailyStandingsSync = async () => {
  try {
    const repeatableJobs = await competitionsQueue.getRepeatableJobs();
    for (const job of repeatableJobs) {
      if (job.name === 'syncNhlStandings' || job.name === 'syncOtherStandings') {
        await competitionsQueue.removeRepeatableByKey(job.key);
      }
    }

    // NHL at 07:30
    await competitionsQueue.add(
      'syncNhlStandings',
      {},
      {
        repeat: {
          pattern: '30 07 * * *',
          tz: 'Europe/Bratislava',
        },
      },
    );

    // Other leagues at 00:30
    await competitionsQueue.add(
      'syncOtherStandings',
      {},
      {
        repeat: {
          pattern: '30 00 * * *',
          tz: 'Europe/Bratislava',
        },
      },
    );

    logger.info('[SCHEDULE] Daily standings sync jobs scheduled (NHL 07:30, Others 00:30 SEČ).');
  } catch (error: any) {
    logger.error(`[SCHEDULE ERROR] Failed to schedule daily standings sync: ${error.message}`);
  }
};
