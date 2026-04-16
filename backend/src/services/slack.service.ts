import axios from 'axios';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

/**
 * SlackService
 * Standalone service for sending Slack notifications.
 */
export const slackService = {
  /**
   * Sends a generic message to Slack
   */
  async sendMessage(text: string) {
    const webhookUrl = env.SLACK_WEBHOOK_URL;

    if (!webhookUrl || webhookUrl.includes('...')) {
      logger.warn('[SlackService] No valid SLACK_WEBHOOK_URL found, skipping notification.');
      return;
    }

    try {
      await axios.post(webhookUrl, { text });
      logger.info('[SlackService] Notification sent successfully');
    } catch (error: any) {
      logger.error(
        { error: error.message, status: error.response?.status },
        '[SlackService] Failed to send notification',
      );
    }
  },

  /**
   * Specifically formatted notification for new user registration
   */
  async notifyNewRegistration(user: { id: string; username: string; email: string }, referralSource?: string | null) {
    const message = `*🔵 Nová registrácia používateľa*\n` +
                    `*Používateľ:* ${user.username}\n` +
                    `*Email:* ${user.email}\n` +
                    (referralSource ? `*Referencia (kód):* \`${referralSource}\`` : `*Referencia:* Žiadna`);
    
    await this.sendMessage(message);
  },

  /**
   * Specifically formatted notification for new feedback
   */
  async notifyNewFeedback(data: { type: string; message: string; username: string; email: string; feedbackId: string }) {
    const emoji = data.type === 'bug' ? '🔴' : '🟡';
    const message = `*${emoji} Nový Feedback*\n` +
                    `*Od:* ${data.username} (${data.email})\n` +
                    `*Typ:* ${data.type.toUpperCase()}\n` +
                    `*Správa:* ${data.message}\n` +
                    `*Link:* <${env.FRONTEND_URL}/admin/feedback/${data.feedbackId}|Zobraziť v adminovi>`;
    
    await this.sendMessage(message);
  },

  /**
   * Specifically formatted notification for new group creation
   */
  async notifyNewGroup(data: { name: string; username: string; competitionName: string }) {
    const message = `*🟢 Nová skupina vytvorená*\n` +
                    `*Názov:* ${data.name}\n` +
                    `*Vlastník:* ${data.username}\n` +
                    `*Súťaž:* ${data.competitionName}`;
    
    await this.sendMessage(message);
  },

  /**
   * Specifically formatted notification for competition join
   */
  async notifyCompetitionJoin(data: { username: string; competitionName: string }) {
    const message = `*🏆 Nový hráč v súťaži*\n` +
                    `*Hráč:* ${data.username}\n` +
                    `*Súťaž:* ${data.competitionName}`;
    
    await this.sendMessage(message);
  },

  /**
   * Specifically formatted notification for background job failures
   */
  async notifyJobFailure(data: { queueName: string; jobName: string; error: string; attempts: number }) {
    const message = `*🔴 Zlyhanie úlohy (Queue Failure)*\n` +
                    `*Queue:* \`${data.queueName}\`\n` +
                    `*Úloha:* \`${data.jobName}\`\n` +
                    `*Pokusy:* ${data.attempts}\n` +
                    `*Chyba:* \`${data.error}\``;
    
    await this.sendMessage(message);
  }
};




