import { IceGlassCard } from '@/components/ui/ice-glass-card';
import { IceGlassSelect } from '@/components/ui/ice-glass-select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import { Activity, Layers, Tag, Save } from 'lucide-react';

interface MatchStatusSidebarProps {
  status: string;
  onStatusChange: (val: string) => void;
  isStatusDirty?: boolean;

  apiHockeyId: string;
  onApiIdChange: (val: string) => void;
  isApiIdDirty?: boolean;

  apiHockeyStatus: string;
  onApiStatusChange: (val: string) => void;
  isApiStatusDirty?: boolean;

  stageType: string;
  onStageChange: (val: string) => void;
  isStageDirty?: boolean;

  isDirty?: boolean;
  onSave: () => void;
}

export const MatchStatusSidebar = ({
  status,
  onStatusChange,
  isStatusDirty = false,
  apiHockeyId,
  onApiIdChange,
  isApiIdDirty = false,
  apiHockeyStatus,
  onApiStatusChange,
  isApiStatusDirty = false,
  stageType,
  onStageChange,
  isStageDirty = false,
  isDirty = false,
  onSave,
}: MatchStatusSidebarProps) => {
  const t = useTranslations('Admin.Matches.detail');
  const tStatus = useTranslations('Admin.Matches.statuses');

  const statusOptions = [
    { value: 'scheduled', label: tStatus('scheduled') },
    { value: 'live', label: tStatus('live') },
    { value: 'finished', label: tStatus('finished') },
    { value: 'cancelled', label: tStatus('cancelled') },
  ];

  const stageOptions = [
    { value: 'regular_season', label: t('stages.regular_season') },
    { value: 'group_phase', label: t('stages.group_phase') },
    { value: 'playoffs', label: t('stages.playoffs') },
    { value: 'pre_season', label: t('stages.pre_season') },
    { value: 'relegation', label: t('stages.relegation') },
    { value: 'promotion', label: t('stages.promotion') },
  ];

  const apiStatusOptions = [
    { value: 'NS', label: 'NS (Not Started)' },
    { value: '1P', label: '1P (1st Period)' },
    { value: '2P', label: '2P (2nd Period)' },
    { value: '3P', label: '3P (3rd Period)' },
    { value: 'OT', label: 'OT (Overtime)' },
    { value: 'SO', label: 'SO (Shootout)' },
    { value: 'FT', label: 'FT (Finished)' },
    { value: 'AET', label: 'AET (After ET)' },
    { value: 'PST', label: 'PST (Postponed)' },
    { value: 'CANC', label: 'CANC (Cancelled)' },
    { value: 'ABD', label: 'ABD (Abandoned)' },
  ];

  const fieldDirtyClass =
    'border-primary shadow-[0_0_20px_rgba(234,179,8,0.4)] ring-1 ring-primary/20 transition-all duration-300';

  return (
    <IceGlassCard
      className={`flex flex-col gap-6 p-6 transition-all duration-300 ${
        isDirty ? 'border-primary/50 shadow-[0_0_20px_rgba(234,179,8,0.1)]' : 'border-white/10'
      }`}
    >
      {/* Main Status Section */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5 px-1">
          <span className="text-[10px] font-black tracking-widest text-white/40 uppercase">
            {t('status_section')}
          </span>
          <div className="flex items-center gap-2">
            <div
              className={`h-1.5 w-1.5 rounded-full ${
                status === 'live'
                  ? 'animate-pulse bg-red-500'
                  : status === 'finished'
                    ? 'bg-emerald-500'
                    : 'bg-white/20'
              }`}
            />
            <span className="text-[10px] font-black tracking-widest text-white/80 uppercase">
              {status}
            </span>
          </div>
        </div>

        <IceGlassSelect
          options={statusOptions}
          value={status}
          onChange={(val) => val && onStatusChange(val)}
          allowClear={false}
          isDirty={isStatusDirty}
          className="w-full"
        />
      </div>

      {/* API & Stage Section */}
      <div className="flex flex-col gap-4 border-t border-white/5 pt-6">
        <span className="block px-1 text-[10px] font-black tracking-widest text-white/40 uppercase">
          {t('api_section')}
        </span>

        <div className="flex flex-col gap-6">
          {/* Stage Type */}
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 px-1 text-[9px] font-bold tracking-wider text-white/30 uppercase">
              <Layers className="h-3 w-3" />
              {t('stage_type')}
            </label>
            <IceGlassSelect
              options={stageOptions}
              value={stageType}
              onChange={(val) => val && onStageChange(val)}
              allowClear={false}
              isDirty={isStageDirty}
              className="w-full bg-white/5"
            />
          </div>

          {/* API Status */}
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 px-1 text-[9px] font-bold tracking-wider text-white/30 uppercase">
              <Activity className="h-3 w-3" />
              {t('api_hockey_status')}
            </label>
            <IceGlassSelect
              options={apiStatusOptions}
              value={apiHockeyStatus}
              onChange={(val) => val && onApiStatusChange(val)}
              allowClear={false}
              isDirty={isApiStatusDirty}
              className="w-full bg-white/5"
            />
          </div>

          {/* API Hockey ID */}
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 px-1 text-[9px] font-bold tracking-wider text-white/30 uppercase">
              <Tag className="h-3 w-3" />
              {t('api_hockey_id')}
            </label>
            <Input
              value={apiHockeyId}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '');
                onApiIdChange(val);
              }}
              className={`rounded-app focus:border-primary/50 focus:ring-primary/20 h-12 bg-white/5 px-4 text-sm font-bold text-white transition-all focus:ring-1 ${
                isApiIdDirty ? fieldDirtyClass : 'border-white/10'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-2 text-center">
        <Button
          size="lg"
          onClick={onSave}
          disabled={!isDirty}
          className="bg-primary hover:bg-primary/80 group flex w-full items-center justify-center gap-3 font-black tracking-widest text-black uppercase shadow-[0_0_20px_rgba(234,179,8,0.2)] transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-30 disabled:grayscale"
        >
          <Save className="h-5 w-5 transition-transform group-hover:rotate-12" />
          {t('save_changes')}
        </Button>
      </div>
    </IceGlassCard>
  );
};
