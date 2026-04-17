'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { IceGlassCard } from '@/components/ui/ice-glass-card';
import { useAdminMatchSync } from '../api/use-admin-match-sync';

export const AdminMatchSyncForm = () => {
  const t = useTranslations('Admin.Matches.sync');
  const [apiSportId, setApiSportId] = useState('');
  const [daysAhead, setDaysAhead] = useState('14');
  const { syncMatches, isSyncing } = useAdminMatchSync();

  const handleSync = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiSportId) return;

    await syncMatches(Number(apiSportId), Number(daysAhead));
  };

  return (
    <IceGlassCard className="relative overflow-hidden border-white/10 p-6 shadow-2xl">
      <div className="from-primary/5 pointer-events-none absolute inset-0 bg-gradient-to-br to-transparent" />
      
      <form onSubmit={handleSync} className="relative flex flex-col gap-6 md:flex-row md:items-end">
        <div className="flex flex-1 flex-col gap-2">
          <Label htmlFor="apiSportId" className="text-[10px] font-black uppercase tracking-widest text-white/50">
            {t('api_sport_id')}
          </Label>
          <Input
            id="apiSportId"
            type="number"
            placeholder="57"
            value={apiSportId}
            onChange={(e) => setApiSportId(e.target.value)}
            className="border-white/10 bg-white/5 text-white h-11 rounded-xl"
            required
          />
        </div>

        <div className="flex flex-1 flex-col gap-2">
          <Label htmlFor="daysAhead" className="text-[10px] font-black uppercase tracking-widest text-white/50">
            {t('days_ahead')}
          </Label>
          <Input
            id="daysAhead"
            type="number"
            placeholder="14"
            value={daysAhead}
            onChange={(e) => setDaysAhead(e.target.value)}
            className="border-white/10 bg-white/5 text-white h-11 rounded-xl"
          />
        </div>

        <Button 
          type="submit" 
          disabled={isSyncing || !apiSportId}
          className="h-11 rounded-xl px-8 font-black uppercase tracking-widest"
        >
          {isSyncing ? (
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" />
          )}
          {t('submit')}
        </Button>
      </form>
    </IceGlassCard>
  );
};
