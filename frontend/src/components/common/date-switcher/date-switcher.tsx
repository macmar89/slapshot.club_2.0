import { Button } from '@/components/ui/button';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { useParams, useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import { API_ROUTES } from '@/lib/api-routes';
import { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { useRouter, usePathname } from '@/i18n/routing';
import dynamic from 'next/dynamic';
import { useUserTimezone } from '@/hooks/use-user-config';

const CalendarDialog = dynamic(
  () => import('./calendar-dialog').then((mod) => mod.CalendarDialog),
  { ssr: false },
);

interface DateSwitcherProps {
  badges?: Record<string, number>;
  availableDays?: string[];
  onDateChange?: (date: string) => void;
}

export const DateSwitcher = ({
  badges,
  availableDays: customAvailableDays,
  onDateChange,
}: DateSwitcherProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const slug = params.slug as string;
  const searchParams = useSearchParams();

  const timezone = useUserTimezone();

  const t = useTranslations('Dashboard.matches');

  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);

  const dateFromUrl = searchParams.get('date');
  const today = format(new Date(), 'yyyy-MM-dd');
  const selectedDate = dateFromUrl || today;

  const { data: rawDates } = useSWR<string[]>(
    !customAvailableDays && slug ? API_ROUTES.COMPETITIONS.MATCHES.CALENDAR(slug, timezone) : null,
  );

  const availableDays = useMemo(() => {
    if (customAvailableDays) return customAvailableDays;
    if (!rawDates) return [];
    const localized = rawDates.map((iso) => format(new Date(iso), 'yyyy-MM-dd'));
    return [...new Set(localized)].sort();
  }, [rawDates, customAvailableDays]);

  const handleDateChange = (direction: 'prev' | 'next') => {
    let newDate = '';

    if (direction === 'prev') {
      const prevDay = [...availableDays].reverse().find((d) => d < selectedDate);
      if (prevDay) newDate = prevDay;
    } else {
      const nextDay = availableDays.find((d) => d > selectedDate);
      if (nextDay) newDate = nextDay;
    }

    if (newDate) {
      if (onDateChange) {
        onDateChange(newDate);
      } else {
        router.push(`${pathname}?date=${newDate}`, { scroll: false });
      }
    }
  };

  return (
    <>
      <div className="order-1 flex-1 md:order-2 md:flex-none">
        <div className="rounded-app flex items-center gap-1 border border-white/20 bg-white/10 p-1 shadow-2xl backdrop-blur-xl">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleDateChange('prev')}
            disabled={availableDays.indexOf(selectedDate!) === 0}
            className={cn(
              'rounded-app group/prev h-10 w-10 border-white/10 bg-white/5 transition-all duration-300 sm:h-11 sm:w-11',
              availableDays.indexOf(selectedDate!) === 0
                ? 'cursor-not-allowed opacity-20'
                : 'hover:bg-primary hover:border-primary hover:text-black',
            )}
          >
            <ChevronLeft
              className={cn(
                'h-5 w-5 transition-colors sm:h-6 sm:w-6',
                availableDays.indexOf(selectedDate!) === 0
                  ? 'text-white/20'
                  : 'text-primary group-hover/prev:text-black',
              )}
              strokeWidth={3}
            />
          </Button>

          <Button
            variant="ghost"
            onClick={() => setIsCalendarOpen(true)}
            className="rounded-app group/center relative flex h-10 min-w-[90px] flex-1 flex-col items-center px-3 py-1 hover:bg-white/5 sm:h-11 sm:px-6 md:min-w-[140px] md:flex-none"
          >
            <div className="mb-0.5 flex items-center gap-1.5">
              <CalendarDays className="text-primary h-3 w-3 transition-transform group-hover/center:scale-110" />
              <span className="text-primary text-[0.55rem] font-black tracking-widest uppercase md:text-[0.6rem]">
                {t('selected_day')}
              </span>
            </div>
            <span className="hidden text-xs font-black tracking-wider text-white uppercase sm:text-sm md:block">
              {selectedDate
                ? new Date(selectedDate).toLocaleDateString('sk-SK', {
                    day: 'numeric',
                    month: 'long',
                  })
                : '-'}
            </span>
            <span className="text-xs font-black tracking-wider text-white uppercase sm:text-sm md:hidden">
              {selectedDate
                ? new Date(selectedDate).toLocaleDateString('sk-SK', {
                    day: 'numeric',
                    month: 'numeric',
                  })
                : '-'}
            </span>

            {badges && badges[selectedDate] > 0 && (
              <div className="bg-primary absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-black text-black ring-2 ring-slate-950">
                {badges[selectedDate]}
              </div>
            )}
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => handleDateChange('next')}
            disabled={availableDays.indexOf(selectedDate!) === availableDays.length - 1}
            className={cn(
              'rounded-app group/next h-10 w-10 border-white/10 bg-white/5 transition-all duration-300 sm:h-11 sm:w-11',
              availableDays.indexOf(selectedDate!) === availableDays.length - 1
                ? 'cursor-not-allowed opacity-20'
                : 'hover:bg-primary hover:border-primary hover:text-black',
            )}
          >
            <ChevronRight
              className={cn(
                'h-5 w-5 transition-colors sm:h-6 sm:w-6',
                availableDays.indexOf(selectedDate!) === availableDays.length - 1
                  ? 'text-white/20'
                  : 'text-primary group-hover/next:text-black',
              )}
              strokeWidth={3}
            />
          </Button>
        </div>
      </div>

      {isCalendarOpen && (
        <CalendarDialog
          isOpen={isCalendarOpen}
          onClose={() => setIsCalendarOpen(false)}
          selectedDate={selectedDate}
          availableDays={availableDays}
          badges={badges}
          onSelectDate={(date) => {
            if (onDateChange) {
              onDateChange(date);
            } else {
              router.push(`${pathname}?date=${date}`, { scroll: false });
            }
            setIsCalendarOpen(false);
          }}
        />
      )}
    </>
  );
};
