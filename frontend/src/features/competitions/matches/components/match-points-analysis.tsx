import { cn } from '@/lib/utils';
import { AlertCircle, BarChart3, LucideIcon, Target, TrendingUp } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface MatchStatCardProps {
  label: string;
  count: number;
  color: string;
  isUser: boolean;
  icon: LucideIcon;
  totalTips: number;
}

const MatchStatCard = ({
  label,
  count,
  color,
  isUser,
  totalTips,
  icon: Icon,
}: MatchStatCardProps) => {
  const t = useTranslations('Dashboard.matches');

  const percentage = totalTips > 0 ? Math.round((count / totalTips) * 100) : 0;
  return (
    <div
      className={cn(
        'rounded-app relative flex items-center gap-3 border p-3 transition-all duration-300 sm:gap-4 sm:p-4',
        isUser
          ? 'bg-warning/15 border-warning/40 shadow-[0_0_30px_rgba(234,179,8,0.1)]'
          : 'border-white/10 bg-white/5',
      )}
    >
      <div
        className={cn(
          'shrink-0 rounded-xl p-2 transition-colors sm:p-2.5',
          isUser ? 'bg-warning/20' : 'bg-white/5',
        )}
      >
        <Icon className={cn('h-4 w-4 sm:h-5 sm:w-5', isUser ? 'text-warning' : 'text-white/20')} />
      </div>

      <div className="min-w-0 flex-1 space-y-1.5 sm:space-y-2">
        <div className="flex items-end justify-between gap-2">
          <span
            className={cn(
              'truncate text-[9px] font-black tracking-widest uppercase sm:text-[10px]',
              isUser ? 'text-warning' : 'text-white/40',
            )}
          >
            {label}
          </span>
          <span className="shrink-0 text-[10px] font-black text-white sm:text-xs">
            {percentage}%
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5 sm:h-2">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-1000',
              color,
              isUser && 'opacity-100 shadow-[0_0_10px_currentColor]',
              !isUser && 'opacity-60',
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      <div className="flex min-w-[35px] shrink-0 flex-col items-end sm:min-w-[45px]">
        <span className="text-lg leading-none font-black text-white italic sm:text-xl">
          {count}
        </span>
        <span className="text-[7px] font-bold tracking-tighter text-white/20 uppercase sm:text-[8px]">
          {t('tips_label')}
        </span>
      </div>

      {isUser && (
        <div className="bg-warning absolute right-1/4 bottom-0 left-1/4 h-0.5 rounded-t-full shadow-[0_0_10px_#eab308]" />
      )}
    </div>
  );
};

export const MatchPointsAnalysis = ({
  currentScore,
  scores,
  totalPredictions,
  userPrediction,
  isStarted,
}: {
  currentScore: { homeScore: number; awayScore: number };
  scores: Record<string, number>;
  totalPredictions: number;
  userPrediction?: { homeGoals: number; awayGoals: number } | null;
  isStarted: boolean;
}) => {
  const t = useTranslations('Dashboard.matches');

  const stats = isStarted
    ? Object.entries(scores).reduce(
        (acc, [scoreKey, count]) => {
          const [hTip, aTip] = scoreKey.split(':').map(Number);
          const hReal = currentScore.homeScore;
          const aReal = currentScore.awayScore;

          const isExact = hTip === hReal && aTip === aReal;
          const isDiff = !isExact && hTip - aTip === hReal - aReal;
          const isTrend =
            !isExact && !isDiff && Math.sign(hTip - aTip) === Math.sign(hReal - aReal);
          const isWrong = Math.sign(hTip - aTip) !== Math.sign(hReal - aReal);

          if (isExact) acc.exact += count;
          else if (isDiff) acc.diff += count;
          else if (isTrend) acc.trend += count;
          else if (isWrong) acc.wrong += count;

          return acc;
        },
        { exact: 0, diff: 0, trend: 0, wrong: 0 },
      )
    : {
        exact: 0,
        diff: 0,
        trend: 0,
        wrong: 0,
      };

  const getUserStatus = () => {
    if (!userPrediction || !isStarted) return null;
    const { homeGoals: hTip, awayGoals: aTip } = userPrediction;
    const { homeScore: hReal, awayScore: aReal } = currentScore;

    if (hTip === hReal && aTip === aReal) return 'exact';
    if (hTip - aTip === hReal - aReal) return 'diff';
    if (Math.sign(hTip - aTip) === Math.sign(hReal - aReal)) return 'trend';
    return 'wrong';
  };

  const userStatus = getUserStatus();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3">
        <MatchStatCard
          label={t('exact_score')}
          count={stats.exact}
          totalTips={totalPredictions}
          color="bg-green-500"
          isUser={userStatus === 'exact'}
          icon={Target}
        />
        <MatchStatCard
          label={t('correct_diff')}
          count={stats.diff}
          totalTips={totalPredictions}
          color="bg-yellow-500"
          isUser={userStatus === 'diff'}
          icon={TrendingUp}
        />
        <MatchStatCard
          label={t('winner_only')}
          count={stats.trend}
          totalTips={totalPredictions}
          color="bg-orange-500"
          isUser={userStatus === 'trend'}
          icon={BarChart3}
        />
        <MatchStatCard
          label={t('wrong_guess')}
          count={stats.wrong}
          totalTips={totalPredictions}
          color="bg-red-500"
          isUser={userStatus === 'wrong'}
          icon={AlertCircle}
        />
      </div>
    </div>
  );
};
