'use client';

import { useState } from 'react';
import { IceGlassCard } from '@/components/ui/ice-glass-card';
import { Button } from '@/components/ui/button';
import { Check, ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { format } from 'date-fns';
import { MatchSaveData } from './match-detail-editor';
import { useAuthStore } from '@/store/use-auth-store';

interface MatchVerificationCardProps {
  isChecked: boolean;
  checkedBy?: string | null;
  checkedAt?: string | null;
  onSave: (data: MatchSaveData) => void;
}

export const MatchVerificationCard = ({
  isChecked,
  checkedBy,
  checkedAt,
  onSave,
}: MatchVerificationCardProps) => {
  const t = useTranslations('Admin.Matches.detail');
  const user = useAuthStore((state) => state.user);
  const [isVerifying, setIsVerifying] = useState(false);

  const isAdmin = user?.role === 'admin';

  const handleVerify = async () => {
    setIsVerifying(true);
    try {
      await onSave({ isChecked: true });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <IceGlassCard
      className={`border-white/10 bg-white/[0.02] shadow-inner transition-all duration-300 ${
        isChecked ? 'border-primary/50 shadow-[0_0_20px_rgba(234,179,8,0.1)]' : ''
      }`}
    >
      <div className="flex items-center justify-between border-b border-white/5 bg-white/5 px-6 py-3">
        <div className="flex items-center gap-2">
          <ShieldCheck
            className={`h-3.5 w-3.5 ${isChecked ? 'text-emerald-500' : 'text-primary/60'}`}
          />
          <span className="text-[10px] font-black tracking-widest text-white/40 uppercase">
            {t('verification_section')}
          </span>
        </div>
        {isChecked && (
          <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5">
            <Check className="h-2.5 w-2.5 text-emerald-500" />
            <span className="text-[8px] font-black text-emerald-500 uppercase">OK</span>
          </div>
        )}
      </div>

      <div className="p-6">
        {!isChecked ? (
          <div className="flex flex-col items-center gap-4 py-2">
            <div className="flex flex-col items-center gap-1 text-center">
              <span className="text-sm font-bold text-white/80">{t('verification_pending')}</span>
              <span className="max-w-[200px] text-[10px] text-white/30">
                {t('verification_description')}
              </span>
            </div>
            <Button size="sm" onClick={handleVerify} disabled={isVerifying}>
              <Check className="mr-2 h-4 w-4" />
              {isVerifying ? t('verifying') || 'Verifying...' : t('verify_match')}
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10">
                <Check className="h-5 w-5 text-emerald-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black tracking-widest text-white/20 uppercase">
                  {t('verified_by')}
                </span>
                {isAdmin ? (
                  <>
                    <span className="text-sm leading-tight font-bold text-white/80">
                      {checkedBy || '-'}
                    </span>
                  </>
                ) : (
                  <span className="text-sm leading-tight font-bold text-white/40 italic">
                    ********
                  </span>
                )}
                <span className="font-mono text-[10px] text-white/30">
                  {checkedAt ? format(new Date(checkedAt), 'dd.MM.yyyy HH:mm') : '-'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </IceGlassCard>
  );
};
