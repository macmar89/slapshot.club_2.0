import axios from 'axios';
import { logger } from '../utils/logger.js';

interface EmailParams {
  to: string;
  subject: string;
  htmlContent: string;
}

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

export const emailService = {
  sendEmail: async ({ to, subject, htmlContent }: EmailParams) => {
    const apiKey = process.env.BREVO_API_KEY;
    const senderName = process.env.BREVO_SENDER_NAME || 'Slapshot Club';
    const senderEmail = process.env.BREVO_SENDER_EMAIL || 'referee@slapshot.club';

    if (!apiKey) {
      logger.error('BREVO_API_KEY is missing in environment variables');
      throw new Error('Email service configuration error');
    }

    try {
      const response = await axios.post(
        BREVO_API_URL,
        {
          sender: { name: senderName, email: senderEmail },
          to: [{ email: to }],
          subject,
          htmlContent,
        },
        {
          headers: {
            'api-key': apiKey,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        },
      );

      logger.info(
        { email: to, messageId: response.data.messageId },
        'Email sent successfully via Brevo',
      );
      return response.data;
    } catch (error: any) {
      logger.error(
        {
          email: to,
          error: error.response?.data || error.message,
          status: error.response?.status,
        },
        'Failed to send email via Brevo',
      );
      throw error;
    }
  },
};
