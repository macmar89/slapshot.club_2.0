import React from 'react';
import { User, Mail } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { IceGlassCard } from '@/components/ui/ice-glass-card';
import { ReferralLink } from '../ReferralLink';

interface ProfileOverviewProps {
  user: {
    username: string;
    email: string;
    referralData?: {
      referralCode?: string;
    };
  };
}

export function ProfileOverview({ user }: ProfileOverviewProps) {
  const t = useTranslations('Account');
  const code = user.referralData?.referralCode;

  return (
    <IceGlassCard backdropBlur="md" className="border-primary/20 p-6 md:col-span-2 md:p-8">
      <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
        <div className="flex flex-col items-center gap-4 md:flex-row md:gap-6">
          <div className="bg-primary/20 border-primary/30 flex h-16 w-16 items-center justify-center rounded-xl border shadow-[0_0_30px_-5px_rgba(var(--primary-rgb),0.4)] md:h-20 md:w-20 md:rounded-2xl">
            <User className="text-primary h-8 w-8 md:h-10 md:w-10" />
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-xl font-black tracking-tight text-white uppercase italic md:text-3xl">
              {user.username}
            </h2>
            <p className="flex items-center justify-center gap-2 text-[10px] font-bold tracking-widest text-white/40 uppercase md:justify-start md:text-sm">
              <Mail className="text-primary h-3 w-3 md:h-4 md:w-4" />
              {user.email}
            </p>
          </div>
        </div>

        {code && <ReferralLink code={code} />}
      </div>
    </IceGlassCard>
  );
}
