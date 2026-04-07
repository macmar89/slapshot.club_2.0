import { AdminMatchDto } from '../admin-matches.types';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Check, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

interface AdminMatchesTableProps {
  matches: AdminMatchDto[];
  isLoading: boolean;
  onRefresh?: () => void;
}

export const AdminMatchesTable = ({ matches }: AdminMatchesTableProps) => {
  const t = useTranslations('Admin.Matches.table');
  const router = useRouter();

  if (!matches || matches.length === 0) {
    return (
      <div className="p-12 text-center text-white/30 font-medium tracking-widest uppercase italic">
        No matches found matching criteria.
      </div>
    );
  }

  const handleRowClick = (matchId: string) => {
    router.push(`/admin/matches/${matchId}`);
  };

  return (
    <div className="w-full overflow-x-auto relative rounded-b-xl hidden md:block">
      <table className="w-full text-sm text-left table-fixed">
        <thead className="text-[10px] uppercase font-black tracking-widest bg-white/5 text-white/40 border-b border-white/10">
          <tr>
            <th scope="col" className="px-6 py-4 w-[20%]">{t('competition')}</th>
            <th scope="col" className="px-6 py-4 w-[15%]">{t('date')}</th>
            <th scope="col" className="px-6 py-4 w-[25%]">{t('teams')}</th>
            <th scope="col" className="px-6 py-4 text-center w-[12%]">{t('result')}</th>
            <th scope="col" className="px-6 py-4 w-[10%]">{t('status')}</th>
            <th scope="col" className="px-6 py-4 text-center w-[9%] leading-tight">{t('checked')}</th>
            <th scope="col" className="px-6 py-4 text-center w-[9%] leading-tight">{t('ranked')}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {matches.map((match) => (
            <tr 
              key={match.id} 
              onClick={() => handleRowClick(match.id)}
              className="hover:bg-white/[0.04] transition-all cursor-pointer group"
            >
              <td className="px-6 py-4 font-medium text-white/90 truncate" title={match.competitionName}>
                {match.competitionName}
              </td>
              <td className="px-6 py-4 text-white/60 font-mono text-[11px] whitespace-nowrap">
                {format(new Date(match.date), 'dd.MM.yyyy HH:mm')}
              </td>
              <td className="px-6 py-4 text-white">
                <div className="flex items-center gap-2">
                  <span className="font-bold truncate" title={match.homeTeam}>{match.homeTeam}</span>
                  <span className="text-white/20 text-[10px] font-black italic shrink-0">VS</span>
                  <span className="font-bold truncate" title={match.awayTeam}>{match.awayTeam}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-center font-mono text-base font-bold text-primary group-hover:scale-110 transition-transform">
                {match.resultHomeScore !== null && match.resultAwayScore !== null 
                  ? `${match.resultHomeScore} : ${match.resultAwayScore}` 
                  : `${t('no_result')} : ${t('no_result')}`
                }
              </td>
              <td className="px-6 py-4">
                <Badge variant={match.status === 'live' ? 'destructive' : match.status === 'finished' ? 'secondary' : 'default'} className="uppercase text-[9px] tracking-tighter font-black h-5">
                  {match.status}
                </Badge>
              </td>
              <td className="px-6 py-4">
                <div className="flex justify-center">
                  {match.isChecked ? <Check className="text-primary w-4 h-4 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]" /> : <X className="text-white/10 w-3 h-3" />}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex justify-center">
                  {match.isRanked ? <Check className="text-primary w-4 h-4 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]" /> : <X className="text-white/10 w-3 h-3" />}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
