'use client';

import { useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import useSWR, { useSWRConfig } from 'swr';
import { API_ROUTES } from '@/lib/api-routes';
import { api } from '@/lib/api';
import { DataLoader } from '@/components/common/data-loader';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { sk, enUS, cs } from 'date-fns/locale';
import { AnnouncementTypeBadge } from '../components/announcement-type-badge';
import { PublicAnnouncementDetailDto } from '../announcements.types';
import { IceGlassCard } from '@/components/ui/ice-glass-card';
import { useAppParams } from '@/hooks/use-app-params';
import { BackLink } from '@/components/common/back-link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function AnnouncementDetailView() {
  const t = useTranslations('Announcements');
  const locale = useLocale();

  const { slug } = useAppParams(['slug']);
  const { mutate } = useSWRConfig();

  const { data: announcement, error, isLoading } = useSWR(API_ROUTES.ANNOUNCEMENTS.DETAIL(slug));

  useEffect(() => {
    const markAsRead = async () => {
      try {
        await api.patch(API_ROUTES.NOTIFICATIONS.READ_ANNOUNCEMENT(slug));
        // Global revalidate for unread announcement badge
        mutate(
          (key) => typeof key === 'string' && key.startsWith('/notifications/unread-count'),
          undefined,
          { revalidate: true }
        );
      } catch (err) {
        console.error('Failed to mark announcement as read', err);
      }
    };

    if (slug) {
      markAsRead();
    }
  }, [slug, mutate]);

  const dateLocale = locale === 'sk' ? sk : locale === 'cs' ? cs : enUS;
  const publishedDate = announcement?.publishedAt
    ? format(new Date(announcement.publishedAt), 'd. MMMM yyyy HH:mm', { locale: dateLocale })
    : '';

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(234,179,8,0.05),transparent),radial-gradient(circle_at_bottom_left,rgba(234,179,8,0.02),transparent)] pb-24 text-white md:pb-8">
      <div className="pb-4">
        <BackLink href="/announcements" />
      </div>

      <DataLoader
        data={announcement}
        isLoading={isLoading}
        error={error}
        skeleton={<div className="h-[400px] w-full animate-pulse rounded-2xl bg-white/5" />}
        notFound={<div className="py-20 text-center text-white/40">{t('empty')}</div>}
      >
        {(item: PublicAnnouncementDetailDto) => (
          <IceGlassCard className="p-6 md:p-10">
            <article>
              <div className="mb-6 flex flex-wrap items-center gap-4">
                <AnnouncementTypeBadge type={item.type} />
                <div className="flex items-center gap-2 text-xs font-medium tracking-widest text-white/60 uppercase">
                  <Calendar className="h-3.5 w-3.5" />
                  {publishedDate}
                </div>
              </div>

              <h1 className="text-primary mb-6 text-3xl font-black tracking-tighter uppercase italic md:text-xl lg:text-2xl">
                {item.title}
              </h1>

              {item.excerpt && (
                <p className="mb-6 text-lg leading-relaxed font-medium text-white italic md:text-xl">
                  {item.excerpt}
                </p>
              )}

              <div className="prose prose-sm prose-invert [&_h3]:text-md [&_code]:text-primary-foreground [&_blockquote]:border-primary/50 [&_a]:text-primary [&_a]:hover:text-primary/80 [&_pre]:rounded-app max-w-none [&_a]:underline [&_blockquote]:mb-4 [&_blockquote]:border-l-4 [&_blockquote]:pl-4 [&_blockquote]:text-white/60 [&_blockquote]:italic [&_code]:rounded [&_code]:bg-white/10 [&_code]:px-1.5 [&_code]:py-0.5 [&_h1]:mb-4 [&_h1]:text-3xl [&_h1]:font-black [&_h1]:tracking-wider [&_h1]:uppercase [&_h1]:italic [&_h2]:mb-3 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:tracking-wider [&_h2]:uppercase [&_h2]:italic [&_h3]:mb-2 [&_h3]:text-xl [&_h3]:font-bold [&_li]:mb-1 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:text-white/80 [&_p]:mb-4 [&_p]:leading-relaxed [&_p]:text-white/80 [&_pre]:mb-4 [&_pre]:overflow-x-auto [&_pre]:bg-white/5 [&_pre]:p-4 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:text-white/80">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{item.content || ''}</ReactMarkdown>
              </div>
            </article>
          </IceGlassCard>
        )}
      </DataLoader>
    </div>
  );
}
