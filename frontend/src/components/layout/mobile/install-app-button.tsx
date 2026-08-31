'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Download, Share } from 'lucide-react';
import { usePwaInstall } from '@/hooks/use-pwa-install';

export const InstallAppButton = () => {
  const t = useTranslations('PWA.install');
  const { canInstall, showIosHint, promptInstall } = usePwaInstall();
  const [isIosHintOpen, setIsIosHintOpen] = useState(false);

  if (!canInstall && !showIosHint) return null;

  if (canInstall) {
    return (
      <button
        type="button"
        onClick={() => promptInstall()}
        className="rounded-app border-primary/20 bg-primary/10 text-primary hover:bg-primary/20 flex min-h-11 w-full items-center justify-center gap-2 border transition-all"
      >
        <Download className="h-4 w-4" />
        <span className="text-[10px] font-black tracking-widest uppercase">{t('action')}</span>
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={() => setIsIosHintOpen((open) => !open)}
        className="rounded-app border-primary/20 bg-primary/10 text-primary hover:bg-primary/20 flex min-h-11 w-full items-center justify-center gap-2 border transition-all"
      >
        <Share className="h-4 w-4" />
        <span className="text-[10px] font-black tracking-widest uppercase">{t('action')}</span>
      </button>
      {isIosHintOpen && (
        <p className="rounded-app border border-white/10 bg-white/5 p-3 text-[11px] leading-relaxed font-medium text-white/60">
          {t('ios_hint')}
        </p>
      )}
    </div>
  );
};
