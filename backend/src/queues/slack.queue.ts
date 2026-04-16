import { Queue } from 'bullmq';
import { redisConfig } from '../config/redis.config.js';

export const slackQueue = new Queue('slack-queue', {
  connection: redisConfig,
  defaultJobOptions: {
    attempts: 5, // More attempts for external API
    backoff: {
      type: 'exponential',
      delay: 10000, // 10s initial backoff
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
});

export const enqueueSlackRegistrationNotification = async (data: {
  user: { id: string; username: string; email: string };
  referralSource?: string | null | undefined;

}) => {
  await slackQueue.add('new-registration', data);
};

export const enqueueSlackFeedbackNotification = async (data: {
  type: string;
  message: string;
  username: string;
  email: string;
  feedbackId: string;
}) => {
  await slackQueue.add('new-feedback', data);
};

export const enqueueSlackGroupNotification = async (data: {
  name: string;
  username: string;
  competitionName: string;
}) => {
  await slackQueue.add('new-group', data);
};

export const enqueueSlackCompetitionJoinNotification = async (data: {
  username: string;
  competitionName: string;
}) => {
  await slackQueue.add('new-competition-join', data);
};

export const enqueueSlackJobFailureNotification = async (data: {
  queueName: string;
  jobName: string;
  error: string;
  attempts: number;
}) => {
  await slackQueue.add('job-failure', data);
};


