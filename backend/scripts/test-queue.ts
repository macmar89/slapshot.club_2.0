import 'dotenv/config';
import { emailQueue } from '../src/queues/email.queue.js';
import { logger } from '../src/utils/logger.js';

async function testEmailQueue() {
  console.log('Adding test job to email queue...');

  try {
    const job = await emailQueue.add('verification-email', {
      type: 'verification-email',
      data: {
        user: {
          username: 'testuser',
          email: 'marian@slapshot.club',
          preferredLanguage: 'sk',
        },
        token: 'test-token-123',
        locale: 'sk',
      },
    });

    console.log(`Job added with ID: ${job.id}`);
    console.log('Check server logs for processing status.');

    // Give it a few seconds before exiting
    setTimeout(() => {
      console.log('Test script finished.');
      process.exit(0);
    }, 5000);
  } catch (error) {
    console.error('Failed to add job:', error);
    process.exit(1);
  }
}

testEmailQueue();
