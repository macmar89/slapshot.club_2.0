import { cn } from '@/lib/utils';
import Image from 'next/image';
import { getLogoUrl } from '@/lib/utils/logo';

interface MatchTeamDisplayProps {
  name: string;
  shortName: string;
  logoUrl: string | null;
  size?: 'small' | 'large';
}

export const MatchTeamDisplay = ({
  name,
  shortName,
  logoUrl,
  size = 'small',
}: MatchTeamDisplayProps) => {
  const isLarge = size === 'large';

  return (
    <div className={cn('flex w-1/3 flex-col items-center gap-3 select-none')}>
      <div
        className={cn(
          'group relative flex h-12 w-20 items-center justify-center md:h-14 md:w-28',
          !logoUrl && 'rounded-app overflow-hidden border border-white/10 bg-white/5 p-2',
          isLarge ? 'h-20 w-28' : 'h-12 w-20',
        )}
      >
        {!logoUrl && (
          <div className="absolute inset-0 opacity-20 transition-opacity group-hover:opacity-30" />
        )}
        {logoUrl && (
          <Image
            src={getLogoUrl(logoUrl)}
            alt={name}
            width={isLarge ? 120 : 80}
            height={isLarge ? 80 : 60}
            className="rounded-app relative z-10 h-full w-auto object-contain drop-shadow-2xl"
            sizes={isLarge ? '120px' : '80px'}
            quality={75}
            loading="lazy"
          />
        )}
      </div>
      <div className="text-center">
        <div
          className={cn(
            'line-clamp-1 hidden font-bold text-white md:block',
            isLarge ? 'text-lg' : 'text-sm',
          )}
        >
          {name}
        </div>
        <div className="line-clamp-1 text-[0.65rem] font-bold tracking-wider text-white uppercase md:hidden">
          {shortName}
        </div>
      </div>
    </div>
  );
};
