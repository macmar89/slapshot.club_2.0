import { AdminMatchDto } from '../admin-matches.types';
import { IceGlassCard } from '@/components/ui/ice-glass-card';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Check, X } from 'lucide-react';

interface AdminMatchesTableProps {
  matches: AdminMatchDto[];
  isLoading: boolean;
  onRefresh?: () => void;
}

export const AdminMatchesTable = ({ matches, isLoading }: AdminMatchesTableProps) => {
  if (isLoading) {
    return (
      <IceGlassCard className="p-8 relative">
        <div className="flex justify-center items-center h-40">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-white"></div>
        </div>
      </IceGlassCard>
    );
  }

  if (!matches || matches.length === 0) {
    return (
      <IceGlassCard className="p-8 text-center text-white/50 relative">
        No matches found matching criteria.
      </IceGlassCard>
    );
  }

  return (
    <div className="w-full overflow-x-auto relative rounded-b-xl">
      <table className="w-full text-sm text-left">
        <thead className="text-[10px] uppercase font-black tracking-widest bg-white/5 text-white/40 border-b border-white/10">
          <tr>
            <th scope="col" className="px-6 py-4">Súťaž</th>
            <th scope="col" className="px-6 py-4">Dátum</th>
            <th scope="col" className="px-6 py-4">Zápas</th>
            <th scope="col" className="px-6 py-4 text-center">Skóre</th>
            <th scope="col" className="px-6 py-4">Status</th>
            <th scope="col" className="px-6 py-4 text-center">Skontrolované</th>
            <th scope="col" className="px-6 py-4 text-center">Ranked</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {matches.map((match) => (
            <tr key={match.id} className="hover:bg-white/[0.02] transition-colors">
              <td className="px-6 py-4 font-medium text-white/90 max-w-[150px] truncate" title={match.competitionName}>
                {match.competitionName}
              </td>
              <td className="px-6 py-4 text-white/70 font-mono text-xs">
                {format(new Date(match.date), 'dd.MM.yyyy HH:mm')}
              </td>
              <td className="px-6 py-4 text-white">
                <span className="font-bold">{match.homeTeam}</span>
                <span className="text-white/30 mx-2 text-xs font-black italic">VS</span>
                <span className="font-bold">{match.awayTeam}</span>
              </td>
              <td className="px-6 py-4 text-center font-mono text-base font-bold text-primary">
                {match.result ? `${match.result.homeScore ?? '-'} : ${match.result.awayScore ?? '-'}` : '- : -'}
              </td>
              <td className="px-6 py-4">
                <Badge variant={match.status === 'live' ? 'destructive' : match.status === 'finished' ? 'secondary' : 'default'} className="uppercase text-[9px] tracking-wider font-black">
                  {match.status}
                </Badge>
              </td>
              <td className="px-6 py-4">
                <div className="flex justify-center">
                  {match.isChecked ? <Check className="text-primary w-5 h-5 drop-shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]" /> : <X className="text-white/20 w-4 h-4" />}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex justify-center">
                  {match.isRanked ? <Check className="text-primary w-5 h-5 drop-shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]" /> : <X className="text-white/20 w-4 h-4" />}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
