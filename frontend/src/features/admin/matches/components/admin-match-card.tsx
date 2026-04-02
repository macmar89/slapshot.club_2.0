import { AdminMatchDto } from '../admin-matches.types';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Check, X, Calendar, Trophy } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { IceGlassCard } from '@/components/ui/ice-glass-card';

interface AdminMatchCardProps {
  match: AdminMatchDto;
}

export const AdminMatchCard = ({ match }: AdminMatchCardProps) => {
  const t = useTranslations('Admin.Matches.table');
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/admin/matches/${match.id}`);
  };

  return (
    <IceGlassCard 
      onClick={handleCardClick}
      className="p-4 flex flex-col gap-4 border-white/10 hover:border-primary/30 transition-all cursor-pointer active:scale-[0.98]"
    >
      {/* Header: Competition & Date */}
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1 max-w-[70%]">
          <div className="flex items-center gap-1.5">
            <Trophy className="h-3 w-3 text-primary/60" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white/40 truncate">
              {match.competitionName}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3 w-3 text-white/30" />
            <span className="text-[11px] font-mono text-white/60">
              {format(new Date(match.date), 'dd.MM.yyyy HH:mm')}
            </span>
          </div>
        </div>
        <Badge 
          variant={match.status === 'live' ? 'destructive' : match.status === 'finished' ? 'secondary' : 'default'} 
          className="uppercase text-[8px] tracking-tight font-black h-5"
        >
          {match.status}
        </Badge>
      </div>

      {/* Teams & Score */}
      <div className="flex items-center justify-between bg-white/5 rounded-2xl p-4 border border-white/5">
        <div className="flex flex-col items-center gap-1 w-[40%]">
          <span className="text-sm font-bold text-white text-center line-clamp-2 leading-tight">
            {match.homeTeam}
          </span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <div className="text-xl font-black text-primary tracking-tighter tabular-nums drop-shadow-[0_0_10px_rgba(234,179,8,0.3)]">
            {match.result 
              ? `${match.result.homeScore ?? t('no_result')} : ${match.result.awayScore ?? t('no_result')}` 
              : `${t('no_result')} : ${t('no_result')}`
            }
          </div>
          <span className="text-[10px] font-black italic text-white/20 uppercase tracking-widest">VS</span>
        </div>

        <div className="flex flex-col items-center gap-1 w-[40%]">
          <span className="text-sm font-bold text-white text-center line-clamp-2 leading-tight">
            {match.awayTeam}
          </span>
        </div>
      </div>

      {/* Footer: Admin Status */}
      <div className="flex items-center justify-between pt-2 border-t border-white/5">
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/30">{t('checked')}</span>
            {match.isChecked ? <Check className="text-primary w-4 h-4" /> : <X className="text-white/10 w-3 h-3" />}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/30">{t('ranked')}</span>
            {match.isRanked ? <Check className="text-primary w-4 h-4" /> : <X className="text-white/10 w-3 h-3" />}
          </div>
        </div>
      </div>
    </IceGlassCard>
  );
};
