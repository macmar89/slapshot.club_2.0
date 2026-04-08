import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { IceGlassSelect } from '@/components/ui/ice-glass-select';
import { UseFormRegister, FieldErrors, UseFormSetValue, FormState, UseFormWatch } from 'react-hook-form';
import {
  AnnouncementFormValues,
  AnnouncementType,
  announcementTypes,
} from '../announcements.types';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';
import { Pin } from 'lucide-react';

interface AnnouncementGeneralFieldsProps {
  register: UseFormRegister<AnnouncementFormValues>;
  errors: FieldErrors<AnnouncementFormValues>;
  setValue: UseFormSetValue<AnnouncementFormValues>;
  watch: UseFormWatch<AnnouncementFormValues>;
  selectedType: string;
  dirtyFields: FormState<AnnouncementFormValues>['dirtyFields'];
  isDisabled?: boolean;
}

export const AnnouncementGeneralFields = ({
  register,
  errors,
  setValue,
  watch,
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

      <div className="flex items-center justify-between gap-4 rounded-app border border-white/10 bg-white/5 p-4 md:col-span-2">
        <div className="flex items-center gap-3">
          <div className="bg-primary/20 text-primary flex h-10 w-10 items-center justify-center rounded-full">
            <Pin size={20} className={cn(watch('isPinned') && 'fill-primary')} />
          </div>
          <div className="flex flex-col">
            <Label className="text-sm font-bold tracking-widest text-white uppercase italic">
              {t('is_pinned')}
            </Label>
            <span className="text-[10px] text-white/40 uppercase tracking-widest leading-none mt-1">
              {t('is_pinned_desc')}
            </span>
          </div>
        </div>
        <Switch
          checked={watch('isPinned') || false}
          onCheckedChange={(checked) => setValue('isPinned', checked, { shouldDirty: true })}
          disabled={isDisabled}
        />
      </div>
    </div>
  );
};
