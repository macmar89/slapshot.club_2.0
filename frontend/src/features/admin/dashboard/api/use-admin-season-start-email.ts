import { useState } from 'react';
import { api } from '@/lib/api';
import { API_ROUTES } from '@/lib/api-routes';

interface SendSeasonStartEmailsResult {
  recipientCount: number;
}

export function useAdminSeasonStartEmail() {
  const [isSending, setIsSending] = useState(false);

  const sendSeasonStartEmails = async (): Promise<SendSeasonStartEmailsResult | null> => {
    setIsSending(true);
    try {
      const response = await api.post(API_ROUTES.ADMIN.EMAILS.SEND_SEASON_START);
      return response.data.data as SendSeasonStartEmailsResult;
    } finally {
      setIsSending(false);
    }
  };

  return { sendSeasonStartEmails, isSending };
}
