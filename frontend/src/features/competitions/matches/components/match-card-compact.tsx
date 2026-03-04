import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { getLogoUrl } from '@/lib/logo';
import { useLocale, useTranslations } from 'next-intl';
import { usePredictionStore } from '../../predictions/store/use-prediction-store';

interface MatchCardCompactProps {
  matchId: string;
  homeTeamName: string;
  homeTeamShortName: string;
  homeTeamLogoUrl: string | null;
  awayTeamName: string;
  awayTeamShortName: string;
  awayTeamLogoUrl: string | null;
  matchDate: string;
  refresh: () => void;
}

export const MatchCardCompact = ({
  matchId,
  homeTeamName,
  homeTeamShortName,
  homeTeamLogoUrl,
  awayTeamName,
  awayTeamShortName,
  awayTeamLogoUrl,
  matchDate,
  refresh,
}: MatchCardCompactProps) => {
  const locale = useLocale();
  const t = useTranslations('Dashboard');

  const openPrediction = usePredictionStore((state) => state.openPrediction);

  const handleOpenPrediction = () => {
    openPrediction(
      {
        id: matchId,
        homeTeamName,
        homeTeamShortName,
        homeTeamLogoUrl,
        awayTeamName,
        awayTeamShortName,
        awayTeamLogoUrl,
        date: matchDate,
      },
      undefined,
      refresh,
    );
  };

  return (
    <>
      <div className="rounded-app group/match flex flex-col gap-6 border border-white/5 bg-white/5 p-4 transition-all hover:border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-center gap-2">
            <div className="relative flex h-16 w-16 items-center justify-center">
              {homeTeamLogoUrl ? (
                <Image
                  src={getLogoUrl(homeTeamLogoUrl)}
                  alt={homeTeamShortName}
                  fill
                  className="object-contain"
                />
              ) : (
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-white/10 shadow-lg"
                  style={{ backgroundColor: '#333' }}
                >
                  <span className="text-sm font-black text-white">{homeTeamShortName}</span>
                </div>
              )}
            </div>
            <span className="text-xs font-bold tracking-wider text-white uppercase">
              {homeTeamShortName}
            </span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <div className="text-xl font-black text-white/40 italic">VS</div>
            <div className="text-primary text-[14px] font-bold uppercase">
              {new Date(matchDate).toLocaleDateString(locale)}
            </div>
            <div className="text-[12px] font-bold tracking-widest text-white uppercase italic">
              {new Date(matchDate).toLocaleTimeString(locale, {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="relative flex h-16 w-16 items-center justify-center">
              {awayTeamLogoUrl ? (
                <Image
                  src={getLogoUrl(awayTeamLogoUrl)}
                  alt={awayTeamShortName}
                  fill
                  className="object-contain"
                />
              ) : (
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-white/10 shadow-lg"
                  style={{ backgroundColor: '#333' }}
                >
                  <span className="text-sm font-black text-white">{awayTeamShortName}</span>
                </div>
              )}
            </div>
            <span className="text-xs font-bold tracking-wider text-white uppercase">
              {awayTeamShortName}
            </span>
          </div>
        </div>

        <Button
          onClick={handleOpenPrediction}
          className="w-full gap-2 py-4 text-[10px] font-black tracking-[0.1em] uppercase shadow-[0_4px_15px_rgba(234,179,8,0.2)] transition-all hover:scale-[1.02]"
        >
          {t('place_prediction')}
        </Button>
      </div>
    </>
  );
};
