'use client';

import { useParams } from 'next/navigation';
import { IceGlassCard } from '@/components/ui/ice-glass-card';
import { Button } from '@/components/ui/button';
import { DataLoader } from '@/components/common/data-loader';
import { useTranslations } from 'next-intl';
import { ArrowLeft, RefreshCcw, X } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { MatchDetailEditor, MatchSaveData } from '../components/match-detail-editor';
import useSWR from 'swr';
import { API_ROUTES } from '@/lib/api-routes';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import type { AdminMatchDto } from '@/features/admin/matches/admin-matches.types';

export const AdminMatchDetailView = () => {
  const { id } = useParams<{ id: string }>();
  const t = useTranslations('Admin.Matches.detail');
  const tTable = useTranslations('Admin.Matches.table');

  const {
    data: match,
    isLoading,
    error,
    mutate,
  } = useSWR<AdminMatchDto>(id ? API_ROUTES.ADMIN.MATCHES.DETAIL(id) : null);

  const handleSave = async (data: MatchSaveData) => {
    try {
      const response = await api.patch(API_ROUTES.ADMIN.MATCHES.DETAIL(id as string), data);
      if (response.status === 200) {
        toast.success(tTable('update_success') || 'Match updated successfully');
        mutate();
      }
    } catch (error: unknown) {
      console.error('Error saving match:', error);
      const message = error instanceof Error ? error.message : tTable('update_error');
      toast.error(message || 'Failed to update match');
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 mx-auto flex w-full max-w-5xl flex-col gap-6 p-4 duration-1000 md:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 px-2 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-6">
          <Link href="/admin/matches">
            <Button
              variant="ghost"
              size="icon"
              className="h-12 w-12 rounded-full border border-white/10 bg-white/5 transition-all hover:border-white/20 hover:bg-white/10"
            >
              <ArrowLeft className="h-6 w-6 text-white/50 hover:text-white" />
            </Button>
          </Link>
          <div className="flex flex-col">
            <h1 className="text-2xl font-black tracking-widest text-white/90 uppercase italic drop-shadow-md md:text-3xl">
              {t('title')}
            </h1>
            <span className="text-primary/60 text-[10px] font-bold tracking-widest uppercase">
              Admin Match Management System
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => mutate()}
            className="h-10 gap-2 border border-white/10 bg-white/5 px-4 text-white/60 hover:bg-white/10"
          >
            <RefreshCcw className="h-4 w-4" />
            {tTable('refresh')}
          </Button>
        </div>
      </div>

      <DataLoader
        data={match}
        isLoading={isLoading}
        error={error}
        notFound={
          <div className="p-24 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/5">
              <X className="h-8 w-8 text-white/20" />
            </div>
            <div className="text-xl font-black tracking-widest text-white/30 uppercase italic">
              {t('match_not_found')}
            </div>
          </div>
        }
        skeleton={
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="flex flex-col gap-6 lg:col-span-2">
              <IceGlassCard className="h-80 animate-pulse border-white/10 bg-white/5" />
              <IceGlassCard className="h-40 animate-pulse border-white/10 bg-white/5" />
            </div>
            <div className="flex flex-col gap-6">
              <IceGlassCard className="h-40 animate-pulse border-white/10 bg-white/5" />
              <IceGlassCard className="h-40 animate-pulse border-white/10 bg-white/5" />
            </div>
          </div>
        }
      >
        {(match) => <MatchDetailEditor match={match} onSave={handleSave} />}
      </DataLoader>
    </div>
  );
};
