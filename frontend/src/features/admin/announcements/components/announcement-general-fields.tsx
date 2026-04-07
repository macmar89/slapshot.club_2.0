import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { IceGlassSelect } from '@/components/ui/ice-glass-select';
import { UseFormRegister, FieldErrors, UseFormSetValue } from 'react-hook-form';
import { AnnouncementFormValues, AnnouncementType, announcementTypes } from '../announcements.types';
import { useTranslations } from 'next-intl';

interface AnnouncementGeneralFieldsProps {
  register: UseFormRegister<AnnouncementFormValues>;
  errors: FieldErrors<AnnouncementFormValues>;
  setValue: UseFormSetValue<AnnouncementFormValues>;
  selectedType: string;
}

export const AnnouncementGeneralFields = ({
  register,
  errors,
  setValue,
  selectedType,
}: AnnouncementGeneralFieldsProps) => {
  const t = useTranslations('Admin.Announcements.form');
  const tErrors = useTranslations('Admin.Announcements.errors');

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div className="space-y-2">
        <Label className="text-white/40 font-mono text-[10px] ml-1 tracking-widest uppercase italic">
          {t('slug')}
        </Label>
        <Input
          {...register('slug')}
          placeholder="new-feature-2026"
          className="h-12 border-white/10 bg-white/5 font-mono text-sm tracking-widest uppercase focus:border-primary/50"
        />
        {errors.slug && (
          <span className="text-red-400 text-[10px] font-bold tracking-widest uppercase italic px-1">
            {tErrors(errors.slug.message as never)}
          </span>
        )}
      </div>

      <div className="space-y-2">
        <Label className="text-white/40 font-mono text-[10px] ml-1 tracking-widest uppercase italic">
          {t('type')}
        </Label>
        <IceGlassSelect
          value={selectedType}
          onChange={(val) => setValue('type', val as AnnouncementType)}
          options={announcementTypes.map((type) => ({ label: type, value: type }))}
          placeholder="Select type"
        />
        {errors.type && (
          <span className="text-red-400 text-[10px] font-bold tracking-widest uppercase italic px-1">
            {tErrors(errors.type.message as never)}
          </span>
        )}
      </div>
    </div>
  );
};
