'use client';

import { useParams } from 'next/navigation';
import { useAdminMatchDetail } from '../api/use-admin-match-detail';
import { IceGlassCard } from '@/components/ui/ice-glass-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { IceGlassSelect } from '@/components/ui/ice-glass-select';
import { DataLoader } from '@/components/common/data-loader';
import { useTranslations } from 'next-intl';
import { format } from 'date-fns';
import { Trophy, Calendar, Check, X, ArrowLeft, Save, RefreshCcw } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { useState, useEffect } from 'react';

export const AdminMatchDetailView = () => {
  const { id } = useParams<{ id: string }>();
  const t = useTranslations('Admin.Matches.detail');
  const tTable = useTranslations('Admin.Matches.table');
  
  const { data: match, isLoading, error, mutate } = useAdminMatchDetail(id);
  
  const [homeScore, setHomeScore] = useState<string>('');
  const [awayScore, setAwayScore] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [isRanked, setIsRanked] = useState<boolean>(false);

  useEffect(() => {
    if (match) {
      setHomeScore(match.result?.homeScore?.toString() || '');
      setAwayScore(match.result?.awayScore?.toString() || '');
      setStatus(match.status);
      setIsChecked(match.isChecked);
      setIsRanked(match.isRanked);
    }
  }, [match]);

  const handleSave = () => {
    // Backend implementation will be requested by user later
    console.log('Saving match details:', {
      id,
      homeScore,
      awayScore,
      status,
      isChecked,
      isRanked,
    });
  };

  const statusOptions = [
    { value: 'scheduled', label: tTable('statuses.scheduled') },
    { value: 'live', label: tTable('statuses.live') },
    { value: 'finished', label: tTable('statuses.finished') },
    { value: 'cancelled', label: tTable('statuses.cancelled') },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 mx-auto flex w-full max-w-4xl flex-col gap-6 p-4 duration-700 md:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/matches">
            <Button variant="ghost" size="icon" className="rounded-full bg-white/5 border border-white/10 hover:bg-white/10">
              <ArrowLeft className="h-5 w-5 text-white/70" />
            </Button>
          </Link>
          <h1 className="text-2xl font-black tracking-widest text-white/90 uppercase italic drop-shadow-md md:text-3xl">
            {t('title')}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => mutate()}
            className="gap-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white/60"
          >
            <RefreshCcw className="h-4 w-4" />
            {tTable('refresh')}
          </Button>
          <Button 
            size="sm" 
            onClick={handleSave}
            className="gap-2 bg-primary text-black font-black uppercase tracking-widest hover:bg-primary/80 shadow-[0_0_20px_rgba(234,179,8,0.3)]"
          >
            <Save className="h-4 w-4" />
            {t('save_changes')}
          </Button>
        </div>
      </div>

      <DataLoader
        data={match}
        isLoading={isLoading}
        error={error}
        skeleton={
          <IceGlassCard className="h-96 animate-pulse border-white/10" />
        }
      >
        {(match) => (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Match Overview Card */}
            <IceGlassCard className="col-span-1 border-white/10 p-6 lg:col-span-2">
              <div className="mb-6 flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-primary" />
                  <span className="text-xs font-black uppercase tracking-widest text-white/40">
                    {match.competitionName}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-white/30" />
                  <span className="font-mono text-xs text-white/60">
                    {format(new Date(match.date), 'dd.MM.yyyy HH:mm')}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center gap-8 py-8 md:flex-row md:py-12">
                {/* Home Team */}
                <div className="flex w-full flex-col items-center gap-4 text-center md:w-1/3">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/5 border border-white/10 shadow-inner">
                    <span className="text-3xl font-black text-white/20 uppercase">H</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black uppercase tracking-tighter text-white/30">{t('home_team')}</span>
                    <span className="text-xl font-bold text-white">{match.homeTeam}</span>
                  </div>
                </div>

                {/* Score Input */}
                <div className="flex items-center gap-4 px-4">
                  <div className="flex flex-col items-center gap-2">
                    <Input
                      type="number"
                      value={homeScore}
                      onChange={(e) => setHomeScore(e.target.value)}
                      className="h-16 w-16 text-center text-2xl font-black bg-white/5 border-white/10 text-primary focus:ring-primary/20"
                    />
                  </div>
                  <span className="text-3xl font-black text-white/20 italic">:</span>
                  <div className="flex flex-col items-center gap-2">
                    <Input
                      type="number"
                      value={awayScore}
                      onChange={(e) => setAwayScore(e.target.value)}
                      className="h-16 w-16 text-center text-2xl font-black bg-white/5 border-white/10 text-primary focus:ring-primary/20"
                    />
                  </div>
                </div>

                {/* Away Team */}
                <div className="flex w-full flex-col items-center gap-4 text-center md:w-1/3">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/5 border border-white/10 shadow-inner">
                    <span className="text-3xl font-black text-white/20 uppercase">A</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black uppercase tracking-tighter text-white/30">{t('away_team')}</span>
                    <span className="text-xl font-bold text-white">{match.awayTeam}</span>
                  </div>
                </div>
              </div>
            </IceGlassCard>

            {/* Sidebar Controls */}
            <div className="col-span-1 flex flex-col gap-6">
              {/* Status Card */}
              <IceGlassCard className="border-white/10 p-6">
                <div className="mb-4 flex flex-col gap-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{t('status_section')}</span>
                  <Badge 
                    variant={status === 'live' ? 'destructive' : status === 'finished' ? 'secondary' : 'default'}
                    className="w-fit uppercase text-[9px] font-black tracking-widest"
                  >
                    {status}
                  </Badge>
                </div>
                
                <IceGlassSelect
                  options={statusOptions}
                  value={status}
                  onChange={(val) => val && setStatus(val)}
                  className="w-full"
                />
              </IceGlassCard>

              {/* Verification Card */}
              <IceGlassCard className="border-white/10 p-6">
                <span className="mb-4 block text-[10px] font-black uppercase tracking-widest text-white/40">{t('verification_section')}</span>
                
                <div className="flex flex-col gap-4">
                  <div 
                    onClick={() => setIsChecked(!isChecked)}
                    className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-all ${
                      isChecked ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-white/5 border-white/10 text-white/40'
                    }`}
                  >
                    <span className="text-xs font-black uppercase tracking-widest">{tTable('checked')}</span>
                    {isChecked ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />}
                  </div>

                  <div 
                    onClick={() => setIsRanked(!isRanked)}
                    className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-all ${
                      isRanked ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-white/5 border-white/10 text-white/40'
                    }`}
                  >
                    <span className="text-xs font-black uppercase tracking-widest">{tTable('ranked')}</span>
                    {isRanked ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />}
                  </div>
                </div>
              </IceGlassCard>
            </div>
          </div>
        )}
      </DataLoader>
    </div>
  );
};
