import { Worker, type Job } from 'bullmq';
import { redisConfig } from '../../config/redis.config.js';
import { logger } from '../../utils/logger.js';
import { enqueueSlackJobFailureNotification } from '../../queues/slack.queue.js';
import {
  CLOSE_MONTHLY_PERIODS_JOB,
  MONTHLY_LEADERBOARD_QUEUE_NAME,
  RECALCULATE_MONTHLY_RANKS_JOB,
} from './monthlyLeaderboard.queue.js';
import {
  closeFinishedMonthlyPeriods,
  refreshMonthlyRankings,
} from './monthlyLeaderboard.service.js';
import { formatPeriodKey } from './monthlyLeaderboard.period.js';
import type { RecalculateMonthlyRanksJobData } from './monthlyLeaderboard.types.js';

export const monthlyLeaderboardWorker = new Worker(
  MONTHLY_LEADERBOARD_QUEUE_NAME,
  async (job: Job) => {
    if (job.name === RECALCULATE_MONTHLY_RANKS_JOB) {
      const { competitionId, periodYear, periodMonth } = job.data as RecalculateMonthlyRanksJobData;
      const period = { periodYear, periodMonth };

      logger.info(
        { competitionId, period: formatPeriodKey(period) },
        '[MONTHLY LEADERBOARD WORKER] Recalculating monthly ranks',
      );

      await refreshMonthlyRankings(competitionId, period);
    }

    if (job.name === CLOSE_MONTHLY_PERIODS_JOB) {
      logger.info('[MONTHLY LEADERBOARD WORKER] Closing finished monthly periods');

      await closeFinishedMonthlyPeriods();
    }
  },
  {
    connection: redisConfig,
    concurrency: 1,
    removeOnComplete: {
      age: 24 * 60 * 60,
    },
    removeOnFail: {
      age: 7 * 24 * 60 * 60,
    },
  },
);

monthlyLeaderboardWorker.on('completed', (job: Job) => {
  logger.info(
    { jobId: job.id, name: job.name },
    'Monthly leaderboard queue job completed successfully',
  );
});

monthlyLeaderboardWorker.on('failed', (job: Job | undefined, err: Error) => {
  logger.error(
    { jobId: job?.id, name: job?.name, error: err.message },
    'Monthly leaderboard queue job failed',
  );

  if (job && job.attemptsMade >= (job.opts.attempts || 1)) {
    enqueueSlackJobFailureNotification({
      queueName: MONTHLY_LEADERBOARD_QUEUE_NAME,
      jobName: job.name,
      error: err.message,
      attempts: job.attemptsMade,
    }).catch((slackErr) =>
      logger.error(
        { slackErr },
        '[MONTHLY LEADERBOARD WORKER] Failed to enqueue Slack failure notification',
      ),
    );
  }
});
