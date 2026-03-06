'use client';

import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { useLocale, useTranslations } from 'next-intl';

interface GdprModalContentProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const GdprModalContent = ({ open, onOpenChange }: GdprModalContentProps) => {
  const t = useTranslations('Auth');
  const locale = useLocale();
  const [content, setContent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-gold text-2xl font-bold">
            {t('gdpr_modal.title')}
          </DialogTitle>
        </DialogHeader>

        <div className="min-h-[200px] space-y-4 text-sm leading-relaxed text-white/80">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="border-gold h-8 w-8 animate-spin rounded-full border-b-2"></div>
            </div>
          ) : content ? (
            // <RichTextParser content={content} />
            <div>GDPR content</div>
          ) : (
            <p className="py-10 text-center text-white/50">{t('gdpr_modal.failed_to_load')}</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GdprModalContent;
