'use client';

import React from 'react';
import { Copy, Check } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/use-auth-store';

interface ReferralLinkProps {
  className?: string;
  align?: 'left' | 'center' | 'right';
  title?: string;
}

export function ReferralLink({ className, align = 'right', title }: ReferralLinkProps) {
  const user = useAuthStore((state) => state.user);
  const code = user?.referralCode;

  const t = useTranslations('Account');
  const [copied, setCopied] = React.useState(false);
  const [baseUrl, setBaseUrl] = React.useState('');

  React.useEffect(() => {
    setBaseUrl(window.location.origin);
  }, []);

  const fullUrl = `${baseUrl}/register/${code}`;

  const handleCopy = () => {
    if (!baseUrl) return;
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const alignmentClasses = {
    left: 'items-stretch text-left',
    center: 'items-stretch text-center',
    right: 'items-stretch md:items-end text-center md:text-right',
  };

  return (
    <div className={cn('flex w-full flex-col gap-2', alignmentClasses[align], className)}>
      <div className="flex flex-col gap-1">
        <div className="text-sm font-bold tracking-widest text-white uppercase">
          {title || t('referral_section')}
        </div>
      </div>
      <div
        onClick={handleCopy}
        className="group hover:border-warning/50 hover:bg-warning/10 relative flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg border border-white/10 bg-black/40 px-3 py-2 transition-all duration-300"
      >
        <div className="flex min-w-0 flex-col overflow-hidden">
          <span className="mb-1 truncate font-mono text-[9px] leading-none tracking-tighter text-white/30 uppercase">
            {baseUrl.replace(/^https?:\/\//, '')}/register/
          </span>
          <code className="text-warning truncate font-mono text-lg leading-tight font-black tracking-widest md:text-xl">
            {code}
          </code>
        </div>

        <div className="group-hover:border-warning/20 flex flex-shrink-0 items-center gap-2 border-l border-white/5 pl-3 transition-colors">
          <div className="group-hover:text-warning/80 hidden text-[10px] font-bold tracking-wider text-white/40 uppercase transition-colors sm:block">
            {copied ? t('copied') : t('copy')}
          </div>
          <div className="group-hover:bg-warning/20 flex h-8 w-8 items-center justify-center rounded-md bg-white/5 transition-colors">
            {copied ? (
              <Check className="text-warning h-4 w-4" />
            ) : (
              <Copy className="group-hover:text-warning/80 h-4 w-4 text-white/40" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
