'use client';

import { useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format, startOfMonth, getDay, getDaysInMonth, parseISO } from 'date-fns';

import { sk, cs, enUS } from 'date-fns/locale';
import { useLocale } from 'next-intl';

interface CalendarDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string | null;
  availableDays: string[];
  badges?: Record<string, number>;
  onSelectDate: (date: string) => void;
}

const localeMap = {
  sk: sk,
  cz: cs,
  en: enUS,
};

const getInitialMonthIndex = (availableMonths: string[], date: string | null) => {
  if (!date || availableMonths.length === 0) return 0;
  const monthKey = format(parseISO(date), 'yyyy-MM');
  const index = availableMonths.indexOf(monthKey);
  return index !== -1 ? index : 0;
};

export function CalendarDialog({
  isOpen,
  onClose,
  selectedDate,
  availableDays,
  onSelectDate,
  badges,
}: CalendarDialogProps) {
  const locale = useLocale();
  const currentLocale = localeMap[locale as keyof typeof localeMap] || sk;

  const activeMonths = useMemo(() => {
    if (!availableDays) return [];

    const months = new Set<string>();
    availableDays.forEach((date) => {
      months.add(format(parseISO(date), 'yyyy-MM'));
    });
    return Array.from(months).sort();
  }, [availableDays]);

  const [lastSelectedDate, setLastSelectedDate] = useState(selectedDate);
  const [currentMonthIndex, setCurrentMonthIndex] = useState<number>(() =>
    getInitialMonthIndex(activeMonths, selectedDate),
  );

  // Synchronize state from props (React pattern for adjusting state)
  if (selectedDate !== lastSelectedDate) {
    setLastSelectedDate(selectedDate);
    if (selectedDate && activeMonths.length > 0) {
      const monthKey = format(parseISO(selectedDate), 'yyyy-MM');
      const index = activeMonths.indexOf(monthKey);
      if (index !== -1 && index !== currentMonthIndex) {
        setCurrentMonthIndex(index);
      }
    }
  }

  const todayStr = format(new Date(), 'yyyy-MM-dd');

  const { monthName, calendarDays } = useMemo(() => {
    const currentMonthKey = activeMonths[currentMonthIndex];
    const baseDate = currentMonthKey ? parseISO(`${currentMonthKey}-01`) : new Date();

    const year = baseDate.getFullYear();
    const month = baseDate.getMonth();

    const firstDay = getDay(startOfMonth(baseDate));
    const adjustedFirstDay = (firstDay + 6) % 7;
    const daysInMonth = getDaysInMonth(baseDate);

    const name = format(baseDate, 'LLLL yyyy', { locale: currentLocale });

    const availableDaysSet = new Set(availableDays);

    const days = [];
    for (let i = 0; i < adjustedFirstDay; i++) days.push(null);

    for (let i = 1; i <= daysInMonth; i++) {
      const dateObj = new Date(year, month, i);
      const dateStr = format(dateObj, 'yyyy-MM-dd');
      days.push({
        day: i,
        dateStr,
        hasMatches: availableDaysSet.has(dateStr),
        isSelected: selectedDate === dateStr,
        isToday: dateStr === todayStr,
        badgeCount: badges?.[dateStr] || 0,
      });
    }

    return { monthName: name, calendarDays: days };
  }, [activeMonths, currentMonthIndex, availableDays, selectedDate, currentLocale, todayStr, badges]);

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const day = new Date(2026, 0, 5 + i);
      const formatted = format(day, 'EEEEEE', { locale: currentLocale });

      return formatted.replace('.', '');
    });
  }, [currentLocale]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="overflow-hidden rounded-[2rem] border-white/10 bg-[#0c0f14]/95 p-6 text-white shadow-[0_0_50px_rgba(0,0,0,0.5)] backdrop-blur-3xl sm:max-w-[400px]">
        <div className="bg-primary/10 pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full blur-3xl" />

        <DialogHeader className="mb-4">
          <DialogTitle className="text-primary text-xl font-black tracking-widest uppercase">
            Vyber dátum
          </DialogTitle>
        </DialogHeader>

        <div className="relative z-10">
          <div className="mb-6 flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentMonthIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentMonthIndex === 0}
              className="text-white hover:bg-white/10"
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={currentMonthIndex === 0 ? 2 : 3} />
            </Button>
            <span className="text-sm font-black tracking-widest text-white uppercase">
              {monthName}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                setCurrentMonthIndex((prev) => Math.min(activeMonths.length - 1, prev + 1))
              }
              disabled={currentMonthIndex === activeMonths.length - 1}
              className="text-white hover:bg-white/10"
            >
              <ChevronRight
                className="h-5 w-5"
                strokeWidth={currentMonthIndex === activeMonths.length - 1 ? 2 : 3}
              />
            </Button>
          </div>

          <div className="mb-2 grid grid-cols-7 gap-1">
            {weekDays.map((d) => (
              <div
                key={d}
                className="py-2 text-center text-[0.6rem] font-black text-white/30 uppercase"
              >
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, idx) => {
              if (!day) return <div key={`empty-${idx}`} className="h-10" />;

              const isToday = day.dateStr === todayStr;

              return (
                <Button
                  key={day.dateStr}
                  variant="ghost"
                  disabled={!day.hasMatches}
                  onClick={() => {
                    onSelectDate(day.dateStr);
                    onClose();
                  }}
                  className={cn(
                    'group relative flex h-10 w-full flex-col items-center justify-center rounded-xl p-0 transition-all duration-300',
                    day.isSelected
                      ? 'bg-primary hover:bg-primary/90 z-10 scale-110 font-black text-black shadow-[0_5px_15px_rgba(234,179,8,0.3)]'
                      : day.hasMatches
                        ? 'bg-white/5 text-white hover:bg-white/20'
                        : 'cursor-not-allowed text-white/40 opacity-10',
                  )}
                >
                  <span className="text-xs">{day.day}</span>
                  {day.hasMatches && !day.isSelected && (
                    <div className="bg-primary/50 absolute bottom-1.5 h-1 w-1 rounded-full" />
                  )}
                  {day.badgeCount > 0 && (
                    <div
                      className={cn(
                        'bg-primary absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[8px] font-black text-black ring-2 ring-slate-950 transition-transform group-hover:scale-110',
                        day.isSelected && 'bg-black text-primary ring-primary',
                      )}
                    >
                      {day.badgeCount}
                    </div>
                  )}
                  {isToday && !day.isSelected && (
                    <div className="absolute top-1 right-1 h-1 w-1 rounded-full bg-blue-500" />
                  )}
                </Button>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
