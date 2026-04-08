'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { IceGlassCard } from '@/components/ui/ice-glass-card';
import { AnnouncementFormValues } from '../announcements.types';
import { announcementFormSchema } from '../announcements.schema';
import { AnnouncementGeneralFields } from './announcement-general-fields';
import { AnnouncementLocaleTabs } from './announcement-locale-tabs';
import { AnnouncementFormActions } from './announcement-form-actions';
import { useTranslations, useLocale } from 'next-intl';
import { AlertCircle, CalendarCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { sk, cs, enUS } from 'date-fns/locale';
import { useState } from 'react';
import { AnnouncementPublishDialog } from './announcement-publish-dialog';
import { Locale } from 'date-fns';

const dateLocales: Record<string, Locale> = { sk, cs, en: enUS };

interface AnnouncementFormProps {
  initialValues?: AnnouncementFormValues;
  onSubmit: (data: AnnouncementFormValues) => void;
  onDelete?: () => void;
  isLoading?: boolean;
  isEdit?: boolean;
}

export const AnnouncementForm = ({
  initialValues,
  onSubmit,
  onDelete,
  isLoading,
  isEdit,
}: AnnouncementFormProps) => {
  const [isPublishDialogOpen, setIsPublishDialogOpen] = useState(false);
  const locale = useLocale();
  const isDisabled = !!initialValues?.isPublished;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, dirtyFields, isDirty },
  } = useForm<AnnouncementFormValues>({
    resolver: zodResolver(announcementFormSchema),
    defaultValues: initialValues || {
      slug: '',
      type: 'GENERAL',
      isPublished: false,
      locales: {
        sk: { title: '', excerpt: '', content: '' },
        cz: { title: '', excerpt: '', content: '' },
        en: { title: '', excerpt: '', content: '' },
      },
    },
  });

  useEffect(() => {
    if (initialValues) {
      reset(initialValues);
    }
  }, [initialValues, reset]);

  const t = useTranslations('Admin.Announcements');
  const selectedType = watch('type');

  const handlePublishClick = () => {
    setIsPublishDialogOpen(true);
  };

  const handleConfirmPublish = async () => {
    setIsPublishDialogOpen(false);
    setValue('isPublished', true);
    await handleSubmit(onSubmit)();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <IceGlassCard
        className={cn(
          'flex flex-col gap-6 p-6 transition-all duration-300 md:p-8',
          isDirty ? 'border-primary/50 shadow-[0_0_20px_rgba(234,179,8,0.1)]' : 'border-white/10'
        )}
        withGradient
      >
        <AnnouncementGeneralFields
          register={register}
          errors={errors}
          setValue={setValue}
          selectedType={selectedType}
          dirtyFields={dirtyFields}
          isDisabled={isDisabled}
        />


        <AnnouncementLocaleTabs
          register={register}
          errors={errors}
          watch={watch}
          dirtyFields={dirtyFields}
          isDisabled={isDisabled}
        />

        {/* Unsaved Changes Warning */}
        {isDirty && (
          <div className="animate-in fade-in slide-in-from-top-2 rounded-app my-4 flex items-center gap-3 border border-primary/20 bg-primary/5 px-4 py-3 text-primary ring-1 ring-primary/10">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span className="text-xs font-bold tracking-widest uppercase italic">
              {t('unsaved_changes')}
            </span>
          </div>
        )}

        {isDisabled && initialValues?.publishedAt && (
          <div className="animate-in fade-in slide-in-from-top-2 rounded-app mt-4 flex items-center gap-3 border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-emerald-400 ring-1 ring-emerald-500/10">
            <CalendarCheck className="h-4 w-4 shrink-0" />
            <span className="text-xs font-bold tracking-widest uppercase italic">
              {t('published_at', {
                date: format(new Date(initialValues.publishedAt), 'PPP p', {
                  locale: dateLocales[locale] || sk,
                }),
              })}
            </span>
          </div>
        )}

        <AnnouncementFormActions
          isEdit={isEdit}
          isLoading={isLoading}
          onDelete={onDelete}
          onPublish={handlePublishClick}
          isDirty={isDirty}
          isDisabled={isDisabled}
        />
      </IceGlassCard>

      <AnnouncementPublishDialog
        isOpen={isPublishDialogOpen}
        onOpenChange={setIsPublishDialogOpen}
        onConfirm={handleConfirmPublish}
        isLoading={isLoading}
        isEdit={isEdit}
      />
    </form>
  );
};
