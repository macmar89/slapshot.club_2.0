'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import { ArrowLeft } from 'lucide-react';
import { Link, useRouter } from '@/i18n/routing';
import { AnnouncementForm } from '../components/announcement-form';
import { type AnnouncementFormValues } from '../announcements.types';
import { announcementsApi } from '../api/announcements.api';
import { toast } from 'sonner';

export const AdminCreateAnnouncementView = () => {
  const t = useTranslations('Admin.Announcements');
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async (data: AnnouncementFormValues) => {
    setIsLoading(true);
    try {
      await announcementsApi.create(data);
      toast.success(t('create_success'));
      router.push('/admin/announcements');
    } catch (error) {
      console.error('Error creating announcement:', error);
      toast.error(t('create_error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-4 md:p-8">
      <div className="flex items-center gap-6 px-2">
        <Link href="/admin/announcements">
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
            {t('create_title')}
          </h1>
          <span className="text-primary/60 text-[10px] font-bold tracking-widest uppercase">
            Admin Announcement Management
          </span>
        </div>
      </div>

      <AnnouncementForm onSubmit={handleCreate} isLoading={isLoading} />
    </div>
  );
};
