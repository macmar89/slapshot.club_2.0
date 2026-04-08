'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useSWRConfig } from 'swr';
import useSWR from 'swr';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { API_ROUTES } from '@/lib/api-routes';
import { AnnouncementForm } from '../components/announcement-form';
import { AnnouncementDeleteDialog } from '../components/announcement-delete-dialog';
import { AnnouncementFormValues } from '../announcements.types';
import { DataLoader } from '@/components/common/data-loader';
import { ArrowLeft, X } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { api } from '@/lib/api';
import { IceGlassCard } from '@/components/ui/ice-glass-card';
import { Button } from '@/components/ui/button';

interface AdminAnnouncementDetailViewProps {
  slug: string;
}

export const AdminAnnouncementDetailView = ({ slug }: AdminAnnouncementDetailViewProps) => {
  const t = useTranslations('Admin.Announcements');
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { data, isLoading, error } = useSWR<AnnouncementFormValues>(
    API_ROUTES.ADMIN.ANNOUNCEMENTS.DETAIL(slug)
  );

  const handleSubmit = async (values: AnnouncementFormValues) => {
    try {
      await api.patch(API_ROUTES.ADMIN.ANNOUNCEMENTS.UPDATE(slug), values);

      toast.success(t('update_success'));
      mutate(API_ROUTES.ADMIN.ANNOUNCEMENTS.LIST);

      if (values.slug !== slug) {
        router.push(`/admin/announcements/${values.slug}`);
      } else {
        mutate(API_ROUTES.ADMIN.ANNOUNCEMENTS.DETAIL(slug));
      }
    } catch {
      toast.error(t('update_error'));
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await api.delete(API_ROUTES.ADMIN.ANNOUNCEMENTS.DELETE(slug));
      toast.success(t('delete_success'));
      mutate(API_ROUTES.ADMIN.ANNOUNCEMENTS.LIST);
      router.push('/admin/announcements');
    } catch {
      toast.error(t('delete_error'));
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 mx-auto flex w-full max-w-4xl flex-col gap-6 p-4 duration-700 md:p-8 font-sans">
      {/* Header */}
      <div className="flex items-center gap-6 px-2">
        <Link href="/admin/announcements">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full border border-white/10 bg-white/5 transition-all hover:border-white/20 hover:bg-white/10"
          >
            <ArrowLeft className="h-5 w-5 text-white/50 hover:text-white" />
          </Button>
        </Link>
        <div className="flex flex-col">
          <h1 className="text-2xl font-black tracking-widest text-white/90 uppercase italic drop-shadow-md md:text-3xl">
            {t('edit_title')}
          </h1>
          <span className="text-primary/60 text-[10px] font-bold tracking-widest uppercase">
            Admin Announcement System
          </span>
        </div>
      </div>

      <DataLoader
        data={data}
        isLoading={isLoading}
        error={error}
        notFound={
          <div className="p-24 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/5">
              <X className="h-8 w-8 text-white/20" />
            </div>
            <div className="text-xl font-black tracking-widest text-white/30 uppercase italic">
              {t('announcement_not_found')}
            </div>
          </div>
        }
        skeleton={
          <IceGlassCard className="h-[600px] animate-pulse border-white/10 bg-white/5" />
        }
      >
        {(data) => (
          <AnnouncementForm
            initialValues={data}
            onSubmit={handleSubmit}
            onDelete={() => setIsDeleteDialogOpen(true)}
            isLoading={false}
            isEdit
          />
        )}
      </DataLoader>

      <AnnouncementDeleteDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </div>
  );
};
