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
  const tStatus = useTranslations('Admin.Matches.statuses');
  const router = useRouter();

  if (!matches || matches.length === 0) {
    return (
      <div className="p-12 text-center font-medium tracking-widest text-white/30 uppercase italic">
        No matches found matching criteria.
      </div>
    );
  }

  const handleRowClick = (matchId: string) => {
    router.push(`/admin/matches/${matchId}`);
  };

  return (
    <div className="relative hidden w-full overflow-x-auto rounded-b-xl md:block">
      <table className="w-full table-fixed text-left text-sm">
        <thead className="border-b border-white/10 bg-white/5 text-[10px] font-black tracking-widest text-white/40 uppercase">
          <tr>
            <th scope="col" className="w-[20%] px-6 py-4">
              {t('competition')}
            </th>
            <th scope="col" className="w-[15%] px-6 py-4">
              {t('date')}
            </th>
            <th scope="col" className="w-[25%] px-6 py-4">
              {t('teams')}
            </th>
            <th scope="col" className="w-[12%] px-6 py-4 text-center">
              {t('result')}
            </th>
            <th scope="col" className="w-[10%] px-6 py-4">
              {t('status')}
            </th>
            <th scope="col" className="w-[9%] px-6 py-4 text-center leading-tight">
              {t('checked')}
            </th>
            <th scope="col" className="w-[9%] px-6 py-4 text-center leading-tight">
              {t('ranked')}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {matches.map((match) => (
            <tr
              key={match.id}
              onClick={() => handleRowClick(match.id)}
              className="group cursor-pointer transition-all hover:bg-white/[0.04]"
            >
              <td
                className="truncate px-6 py-4 font-medium text-white/90"
                title={match.competitionName}
              >
                {match.competitionName}
              </td>
              <td className="px-6 py-4 font-mono text-[11px] whitespace-nowrap text-white/60">
                {format(new Date(match.date), 'dd.MM.yyyy HH:mm')}
              </td>
              <td className="px-6 py-4 text-white">
                <div className="flex items-center gap-2">
                  <span className="truncate font-bold" title={match.homeTeam}>
                    {match.homeTeam}
                  </span>
                  <span className="shrink-0 text-[10px] font-black text-white/20 italic">VS</span>
                  <span className="truncate font-bold" title={match.awayTeam}>
                    {match.awayTeam}
                  </span>
                </div>
              </td>
              <td className="text-primary px-6 py-4 text-center font-mono text-base font-bold transition-transform group-hover:scale-110">
                {match.resultHomeScore !== null && match.resultAwayScore !== null
                  ? `${match.resultHomeScore} : ${match.resultAwayScore}`
                  : `${t('no_result')} : ${t('no_result')}`}
              </td>
              <td className="px-6 py-4">
                <Badge
                  variant={
                    match.status === 'live'
                      ? 'destructive'
                      : match.status === 'finished'
                        ? 'secondary'
                        : 'default'
                  }
                  className="h-5 text-[9px] font-black tracking-tighter uppercase"
                >
                  {tStatus(match.status)}
                </Badge>
              </td>
              <td className="px-6 py-4">
                <div className="flex justify-center">
                  {match.isChecked ? (
                    <Check className="text-primary h-4 w-4 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
                  ) : (
                    <X className="h-3 w-3 text-white/10" />
                  )}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex justify-center">
                  {match.isRanked ? (
                    <Check className="text-primary h-4 w-4 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
                  ) : (
                    <X className="h-3 w-3 text-white/10" />
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
