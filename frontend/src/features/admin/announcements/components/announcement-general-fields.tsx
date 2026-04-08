import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { IceGlassSelect } from '@/components/ui/ice-glass-select';
import { UseFormRegister, FieldErrors, UseFormSetValue, FormState } from 'react-hook-form';
import {
  AnnouncementFormValues,
  AnnouncementType,
  announcementTypes,
} from '../announcements.types';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

interface AnnouncementGeneralFieldsProps {
  register: UseFormRegister<AnnouncementFormValues>;
  errors: FieldErrors<AnnouncementFormValues>;
  setValue: UseFormSetValue<AnnouncementFormValues>;
  selectedType: string;
  dirtyFields: FormState<AnnouncementFormValues>['dirtyFields'];
  isDisabled?: boolean;
}

export const AnnouncementGeneralFields = ({
  register,
  errors,
  setValue,
  selectedType,
  dirtyFields,
  isDisabled,
}: AnnouncementGeneralFieldsProps) => {
  const t = useTranslations('Admin.Announcements.form');
  const tErrors = useTranslations('Admin.Announcements.errors');

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div className="space-y-2">
        <Label className="ml-1 font-mono text-[12px] tracking-widest text-white uppercase italic">
          {t('slug')}
        </Label>
        <Input
          {...register('slug')}
          placeholder="new-feature-2026"
          disabled={isDisabled}
          className={cn(
            'focus:border-primary/50 h-12 border-white/10 bg-white/5 font-mono text-sm tracking-widest uppercase transition-all duration-300',
            dirtyFields.slug && !isDisabled && 'border-primary shadow-[0_0_15px_rgba(234,179,8,0.3)] ring-1 ring-primary/20',
            isDisabled && 'cursor-not-allowed opacity-50'
          )}
        />
        {errors.slug && (
          <span className="px-1 text-[10px] font-bold tracking-widest text-red-400 uppercase italic">
            {tErrors(errors.slug.message as never)}
          </span>
        )}
      </div>

      <div className="space-y-2">
        <Label className="ml-1 font-mono text-[12px] tracking-widest text-white uppercase italic">
          {t('type')}
        </Label>
        <IceGlassSelect
          value={selectedType}
          onChange={(val) => setValue('type', val as AnnouncementType)}
          options={announcementTypes.map((type) => ({ label: type, value: type }))}
          placeholder="Select type"
          disabled={isDisabled}
          isDirty={dirtyFields.type && !isDisabled}
        />
        {errors.type && (
          <span className="px-1 text-[10px] font-bold tracking-widest text-red-400 uppercase italic">
            {tErrors(errors.type.message as never)}
          </span>
        )}
      </div>
    </div>
  );
};
