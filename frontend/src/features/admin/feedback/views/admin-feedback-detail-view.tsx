'use client';

import { useEffect, useState } from 'react';
import useSWR, { mutate } from 'swr';
import { API_ROUTES } from '@/lib/api-routes';
import { AdminFeedbackDto, feedbackStatuses, FeedbackStatus } from '../feedback.types';
import { IceGlassCard } from '@/components/ui/ice-glass-card';
import { IceGlassSelect } from '@/components/ui/ice-glass-select';
import { Button } from '@/components/ui/button';
import { DataLoader } from '@/components/common/data-loader';
import { useTranslations } from 'next-intl';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useAppParams } from '@/hooks/use-app-params';
import { feedbackApi } from '@/features/admin/feedback/api/feedback.api';

import { PageHeader } from '@/components/layout/page-header';
import { BackLink } from '@/components/common/back-link';

export const AdminFeedbackDetailView = () => {
  const t = useTranslations('Admin.Feedback');
  const tStatus = useTranslations('Admin.Feedback.status');
  const tType = useTranslations('Admin.Feedback.type');

  const { id } = useAppParams(['id']);

  const [isSaving, setIsSaving] = useState<boolean>(false);

  const {
    data: response,
    isLoading,
    error,
  } = useSWR<AdminFeedbackDto>(API_ROUTES.ADMIN.FEEDBACK.DETAIL(id));

  const feedback = response;

  const [selectedStatus, setSelectedStatus] = useState<FeedbackStatus | undefined>(undefined);

  useEffect(() => {
    if (feedback) {
      setSelectedStatus(feedback.status);
    }
  }, [feedback]);

  const handleUpdateStatus = async () => {
    if (!selectedStatus || selectedStatus === feedback?.status) return;

    setIsSaving(true);
    try {
      await feedbackApi.updateStatus(id, selectedStatus);

      toast.success(t('update_status_success'));
      mutate(API_ROUTES.ADMIN.FEEDBACK.DETAIL(id));
      mutate((key) => typeof key === 'string' && key.startsWith(API_ROUTES.ADMIN.FEEDBACK.LIST));
    } catch {
      toast.error(t('update_status_error'));
    } finally {
      setIsSaving(false);
    }
  };

  const statusOptions = feedbackStatuses.map((s) => ({
    value: s,
    label: tStatus(s),
  }));

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <div className="flex items-center gap-4">
        <BackLink href="/admin/feedback" />
        <PageHeader title={t('detail_title')} className="gap-0" />
      </div>

      <DataLoader
        data={feedback}
        isLoading={isLoading}
        error={error}
        notFound={<div className="text-white/40">{t('feedback_not_found')}</div>}
        skeleton={<IceGlassCard className="h-64 animate-pulse border-white/10" />}
      >
        {(item) => (
          <IceGlassCard className="overflow-hidden border-white/10">
            <div className="grid grid-cols-1 lg:grid-cols-3">
              {/* Message Content */}
              <div className="space-y-6 p-6 md:p-8 lg:col-span-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] tracking-widest text-white/40 uppercase">
                    {tType(item.type)}
                  </span>
                  <span className="text-xs text-white/30 italic">
                    {format(new Date(item.createdAt), 'dd.MM.yyyy HH:mm')}
                  </span>
                </div>

                <div className="space-y-2">
                  <h2 className="font-mono text-[10px] tracking-widest text-white/40 uppercase">
                    {t('message_label')}
                  </h2>
                  <div className="rounded-xl border border-white/5 bg-white/[0.03] p-6 text-sm leading-relaxed whitespace-pre-wrap text-white/80 italic">
                    {item.message}
                  </div>
                </div>

                {item.pageUrl && (
                  <div className="space-y-2">
                    <h2 className="font-mono text-[10px] tracking-widest text-white/40 uppercase">
                      {t('page_url_label')}
                    </h2>
                    <a
                      href={item.pageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-xs break-all text-blue-400 underline transition-colors hover:text-blue-300"
                    >
                      {item.pageUrl}
                    </a>
                  </div>
                )}
              </div>

              {/* Sidebar Info & Controls */}
              <div className="space-y-8 border-t border-white/5 bg-white/[0.02] p-6 md:p-8 lg:border-t-0 lg:border-l">
                <div className="space-y-3">
                  <h2 className="font-mono text-[10px] tracking-widest text-white/40 uppercase">
                    {t('from_user')}
                  </h2>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-bold tracking-tight text-white uppercase italic">
                      @{item.username || t('anonymous')}
                    </span>
                    <span className="font-mono text-[10px] text-white/40">
                      {item.userEmail || '—'}
                    </span>
                    <div className="my-2 h-px w-full bg-white/5" />
                    <span className="font-mono text-[9px] tracking-widest text-white/20 uppercase">
                      UID: {item.userId || '—'}
                    </span>
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label className="font-mono text-[10px] tracking-widest text-white/40 uppercase">
                      {t('filter.status')}
                    </Label>
                    <IceGlassSelect
                      value={selectedStatus || item.status}
                      onChange={(val) => setSelectedStatus(val as FeedbackStatus)}
                      options={statusOptions}
                      isDirty={selectedStatus !== item.status}
                    />
                  </div>

                  <Button
                    onClick={handleUpdateStatus}
                    disabled={isSaving || selectedStatus === item.status}
                    className="w-full font-bold tracking-widest uppercase italic shadow-[0_0_15px_rgba(234,179,8,0.2)]"
                  >
                    {isSaving ? t('saving') : t('save_status')}
                  </Button>
                </div>
              </div>
            </div>
          </IceGlassCard>
        )}
      </DataLoader>
    </div>
  );
};

const Label = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <label className={className}>{children}</label>
);
