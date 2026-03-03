import { cn } from '@/lib/utils';

interface WinRateProps {
  rate?: number;
  className?: string;
  showPercent?: boolean;
}

const getWinRateColor = (rate: number) => {
  if (rate < 30) return 'text-red-500';
  if (rate < 50) return 'text-orange-400';
  if (rate < 70) return 'text-green-400';
  return 'text-primary';
};

export const WinRate = ({ rate = 0, className, showPercent = true }: WinRateProps) => {
  return (
    <div
      className={cn(
        'font-black italic transition-colors duration-500',
        getWinRateColor(rate),
        className,
      )}
    >
      {rate}
      {showPercent && (
        <span className="ml-0.5 text-[0.6em] uppercase not-italic opacity-70">&#37;</span>
      )}
    </div>
  );
};
