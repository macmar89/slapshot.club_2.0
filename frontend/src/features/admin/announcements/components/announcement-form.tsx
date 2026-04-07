'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { IceGlassCard } from '@/components/ui/ice-glass-card';
import { AnnouncementFormValues } from '../announcements.types';
import { announcementFormSchema } from '../announcements.schema';
import { AnnouncementGeneralFields } from './announcement-general-fields';
import { AnnouncementLocaleTabs } from './announcement-locale-tabs';
import { AnnouncementFormActions } from './announcement-form-actions';

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
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
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

  const selectedType = watch('type');

  const handlePublish = async () => {
    setValue('isPublished', true);
    await handleSubmit(onSubmit)();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <IceGlassCard className="flex flex-col gap-6 p-6 md:p-8">
        <AnnouncementGeneralFields
          register={register}
          errors={errors}
          setValue={setValue}
          selectedType={selectedType}
        />

        <AnnouncementLocaleTabs register={register} errors={errors} watch={watch} />

        <AnnouncementFormActions
          isEdit={isEdit}
          isLoading={isLoading}
          onDelete={onDelete}
          onPublish={handlePublish}
        />
      </IceGlassCard>
    </form>
  );
};
