'use client';

import { useParams } from 'next/navigation';
import { IceGlassCard } from '@/components/ui/ice-glass-card';
import { Button } from '@/components/ui/button';
import { DataLoader } from '@/components/common/data-loader';
import { useTranslations } from 'next-intl';
import { RefreshCcw, X } from 'lucide-react';
import {
  MatchDetailEditor,
  MatchSaveData,
} from '@/features/admin/matches/components/match-detail-editor';
import useSWR from 'swr';
import { API_ROUTES } from '@/lib/api-routes';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import type { AdminMatchDto } from '@/features/admin/matches/admin-matches.types';
import { BackLink } from '@/components/common/back-link';
import { PageHeader } from '@/components/layout/page-header';

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
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 px-2 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-6">
          <BackLink href="/admin/matches" />

          <PageHeader title={t('title')} />
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
