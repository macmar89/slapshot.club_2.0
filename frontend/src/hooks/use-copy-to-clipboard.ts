'use client';

import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

export const useCopyToClipboard = () => {
  const t = useTranslations('Groups');

  const copy = async (text: string) => {
    if (!navigator.clipboard) {
      toast.error('Clipboard not supported');
      return false;
    }

    try {
      await navigator.clipboard.writeText(text);
      toast.success(t('copied'));
      return true;
    } catch (err) {
      console.error('Failed to copy: ', err);
      toast.error('Failed to copy');
      return false;
    }
  };

  return { copy };
};
