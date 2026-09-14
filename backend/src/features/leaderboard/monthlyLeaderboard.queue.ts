import { Queue } from 'bullmq';
import { redisConfig } from '../../config/redis.config.js';
import { logger } from '../../utils/logger.js';
import type { RecalculateMonthlyRanksJobData } from './monthlyLeaderboard.types.js';

export const MONTHLY_LEADERBOARD_QUEUE_NAME = 'monthly-leaderboard-queue';

export const RECALCULATE_MONTHLY_RANKS_JOB = 'recalculateMonthlyRanks';

export const CLOSE_MONTHLY_PERIODS_JOB = 'closeFinishedMonthlyPeriods';

export const monthlyLeaderboardQueue = new Queue(MONTHLY_LEADERBOARD_QUEUE_NAME, {
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

export const enqueueMonthlyRanksRecalculation = async (data: RecalculateMonthlyRanksJobData) => {
  await monthlyLeaderboardQueue.add(RECALCULATE_MONTHLY_RANKS_JOB, data);
};

export const scheduleMonthlyPeriodsClosing = async () => {
  try {
    const repeatableJobs = await monthlyLeaderboardQueue.getRepeatableJobs();
    for (const job of repeatableJobs) {
      if (job.name === CLOSE_MONTHLY_PERIODS_JOB) {
        await monthlyLeaderboardQueue.removeRepeatableByKey(job.key);
      }
    }

    await monthlyLeaderboardQueue.add(
      CLOSE_MONTHLY_PERIODS_JOB,
      {},
      {
        repeat: {
          pattern: '0 04 * * *',
          tz: 'Europe/Bratislava',
        },
      },
    );

    logger.info('[SCHEDULE] Monthly periods closing job scheduled (04:00 Europe/Bratislava).');
  } catch (error: any) {
    logger.error(`[SCHEDULE ERROR] Failed to schedule monthly periods closing: ${error.message}`);
  }
};
