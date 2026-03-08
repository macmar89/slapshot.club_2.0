import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

export const PlayerDotsFormLegend = () => {
  const t = useTranslations('PlayerDetail');

  return (
    <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/5 pt-4">
      <div className="flex items-center gap-2 text-[9px] font-black tracking-tight text-white/40 uppercase italic">
        <div className="h-2 w-2 rounded-full bg-emerald-400" />
        {t('exact_tip')}
      </div>
      <div className="flex items-center gap-2 text-[9px] font-black tracking-tight text-white/40 uppercase italic">
        <div className="h-2 w-2 rounded-full bg-blue-400" />
        {t('winner_diff')}
      </div>
      <div className="flex items-center gap-2 text-[9px] font-black tracking-tight text-white/40 uppercase italic">
        <div className="h-2 w-2 rounded-full bg-orange-400" />
        {t('winner')}
      </div>
      <div className="flex items-center gap-2 text-[9px] font-black tracking-tight text-white/40 uppercase italic">
        <div className="h-2 w-2 rounded-full bg-red-500/50" />
        {t('miss')}
      </div>
    </div>
  );
};
type FormResult = 'E' | 'S' | 'W' | 'L' | 'D';
interface PlayerFormDotsProps {
  form: string;
  className?: string;
}

const RESULT_COLORS: Record<string, string> = {
  E: 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)] border border-emerald-300/30',
  S: 'bg-blue-400',
  W: 'bg-orange-400',
  L: 'bg-red-500/50',
  D: 'bg-white/10',
};

export const PlayerFormDots = ({ form, className }: PlayerFormDotsProps) => {
  const results = form.split('') as FormResult[];

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      {results.map((res, i) => (
        <div
          key={i}
          className={cn(
            'h-2.5 w-2.5 rounded-full transition-all hover:scale-125',
            RESULT_COLORS[res] || RESULT_COLORS.D,
          )}
          title={res}
        />
      ))}
    </div>
  );
};
