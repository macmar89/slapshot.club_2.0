import { userRepository } from '../../repositories/user.repository.js';
import { emailQueue } from '../../queues/email.queue.js';
import { logger } from '../../utils/logger.js';
import type { AuditCtx } from '../audit.service.js';

export const sendSeasonStartEmails = async (auditCtx: AuditCtx) => {
  const users = await userRepository.getActiveVerifiedUsersEmailAndLocale();

  await emailQueue.addBulk(
    users.map((user) => ({
      name: 'season-start-email',
      data: {
        type: 'season-start-email',
        data: {
          to: user.email,
          username: user.username,
          locale: user.preferredLanguage ?? 'sk',
        },
      },
    })),
  );

  logger.info(
    { adminUserId: auditCtx.userId, recipientCount: users.length },
    '[Admin] Season start email broadcast enqueued',
  );

  return { recipientCount: users.length };
};
