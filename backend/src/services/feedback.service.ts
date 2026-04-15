import { db } from '../db/index.js';
import { feedback } from '../db/schema/feedback.js';
import { logger } from '../utils/logger.js';
import { APP_CONFIG } from '../config/app.js';
import { emailService } from './email.service.js';
import { notify } from './notifications.service.js';
import { userRepository } from '../repositories/user.repository.js';

export const createFeedback = async (data: {
  type: 'bug' | 'idea' | 'other';
  message: string;
  userId: string;
  pageUrl?: string | undefined;
}) => {
  const [newFeedback] = await db
    .insert(feedback)
    .values({
      type: data.type,
      message: data.message,
      pageUrl: data.pageUrl,
      userId: data.userId,
    })
    .returning();

  if (newFeedback) {
    logger.info(
      { feedbackId: newFeedback.id, type: newFeedback.type, userId: data.userId },
      'New feedback received',
    );

    // 1. Send email to support
    try {
      const userInfo = await userRepository.getUserInfoForNotification(data.userId);

      const htmlContent = `
        <div style="font-family: sans-serif; line-height: 1.5; color: #333;">
          <h2 style="color: #eab308; border-bottom: 2px solid #eab308; padding-bottom: 8px;">Nový Feedback - Slapshot Club</h2>
          <p><strong>Od:</strong> ${userInfo?.username || 'Neznámy'} (${userInfo?.email || data.userId})</p>
          <p><strong>Typ:</strong> <span style="text-transform: uppercase; font-weight: bold;">${data.type}</span></p>
          <p><strong>Správa:</strong></p>
          <div style="background: #f4f4f4; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
            ${data.message.replace(/\n/g, '<br>')}
          </div>
          ${data.pageUrl ? `<p><strong>Stránka:</strong> <a href="${data.pageUrl}">${data.pageUrl}</a></p>` : ''}
          <p style="margin-top: 25px;">
            <a href="${process.env.FRONTEND_URL}/admin/feedback/${newFeedback.id}" 
               style="background: #eab308; color: black; padding: 10px 20px; text-decoration: none; font-weight: bold; border-radius: 5px;">
               Zobraziť v administrácii
            </a>
          </p>
        </div>
      `;

      await emailService.sendEmail({
        to: APP_CONFIG.SUPPORT_EMAIL,
        subject: `[FEEDBACK] ${data.type.toUpperCase()}: ${userInfo?.username || 'User'}`,
        htmlContent,
      });
    } catch (err) {
      logger.error({ err, feedbackId: newFeedback.id }, 'Failed to send feedback email to support');
    }

    // 2. Send in-app and push notification to admins & editors
    try {
      const adminEditorIds = await userRepository.getAdminAndEditorUserIds();

      if (adminEditorIds.length > 0) {
        await notify({
          userIds: adminEditorIds,
          type: 'NEW_FEEDBACK',
          payload: {
            feedbackId: newFeedback.id,
            type: data.type,
          },
        });
      }
    } catch (err) {
      logger.error({ err, feedbackId: newFeedback.id }, 'Failed to send feedback notifications');
    }
  }

  return newFeedback;
};
