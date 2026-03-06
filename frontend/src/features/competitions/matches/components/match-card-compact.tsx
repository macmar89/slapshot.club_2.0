import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { getLogoUrl } from '@/lib/utils/logo';
import { useLocale, useTranslations } from 'next-intl';
import { usePredictionStore } from '../../predictions/store/use-prediction-store';
import { useRouter } from '@/i18n/routing';
import { useAuthStore } from '@/store/use-auth-store';

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
  const t = useTranslations('Dashboard.matches');
  const user = useAuthStore((state) => state.user);
  const router = useRouter();

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
          size="lg"
          onClick={() => {
            if (!user?.isVerified) {
              router.push('/account');
              return;
            }

            handleOpenPrediction();
          }}
        >
          {user?.isVerified ? t('predict_button') : t('verify_to_predict')}
        </Button>
      </div>
    </>
  );
};
