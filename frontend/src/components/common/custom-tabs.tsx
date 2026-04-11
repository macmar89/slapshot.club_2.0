'use client';

import React, { ReactNode, useTransition } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from '@/i18n/routing';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

export interface TabItem {
  value: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  show?: boolean;
  disabled?: boolean;
  href?: string;
}

interface CustomTabsProps {
  items: TabItem[];
  paramName?: string;
  defaultValue?: string;
  className?: string;
  tabsListClassName?: string;
  children: ReactNode;
}

export const CustomTabs = ({
  items,
  paramName = 'tab',
  defaultValue,
  className,
  tabsListClassName,
  children,
}: CustomTabsProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [showLeftIndicator, setShowLeftIndicator] = React.useState(false);
  const [showRightIndicator, setShowRightIndicator] = React.useState(false);

  const visibleItems = items.filter((item) => item.show !== false);
  const currentParamValue = searchParams.get(paramName);
  const activeTab = currentParamValue || defaultValue || visibleItems[0]?.value;

  const checkScroll = React.useCallback(() => {
    const container = scrollContainerRef.current;
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      setShowLeftIndicator(scrollLeft > 5);
      setShowRightIndicator(scrollLeft < scrollWidth - clientWidth - 5);
    }
  }, []);

  React.useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      checkScroll();
      container.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
      return () => {
        container.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, [checkScroll]);

  // Scroll active tab into view
  React.useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      const activeElement = container.querySelector(`[data-state="active"]`) as HTMLElement;
      if (activeElement) {
        activeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        });
      }
    }
  }, [activeTab]);

  const handleTabChange = (value: string) => {
    // If it's already active or disabled, do nothing
    const item = items.find((i) => i.value === value);
    if (value === activeTab || item?.disabled) return;

    startTransition(() => {
      if (item?.href) {
        router.replace(item.href, { scroll: false });
      } else {
        // Fallback to search param logic if no href provided
        const params = new URLSearchParams(searchParams.toString());
        if (value === 'active' || value === defaultValue) {
          params.delete(paramName);
        } else {
          params.set(paramName, value);
        }
        // Use window.location.pathname if pathname isn't working as expected in dynamic routes
        const currentPath = window.location.pathname;
        const queryStr = params.toString();
        router.replace(`${currentPath}${queryStr ? '?' + queryStr : ''}`, { scroll: false });
      }
    });
  };

  // Helper to get grid cols class
  const getGridColsClass = (count: number) => {
    if (count === 1) return 'grid-cols-1';
    if (count === 2) return 'grid-cols-2';
    if (count === 3) return 'grid-cols-3';
    if (count === 4) return 'grid-cols-4';
    return 'grid-cols-3'; // Default fallback
  };

  return (
    <Tabs
      value={activeTab}
      onValueChange={handleTabChange}
      className={cn('flex flex-col', className)}
    >
      <div className="relative mb-4 px-1">
        {/* Indicators */}
        <div
          className={cn(
            'from-background pointer-events-none absolute bottom-0 left-0 z-10 h-full w-8 bg-gradient-to-r to-transparent transition-opacity duration-300 sm:hidden',
            showLeftIndicator ? 'opacity-100' : 'opacity-0',
          )}
        />
        <div
          className={cn(
            'from-background pointer-events-none absolute right-0 bottom-0 z-10 h-full w-8 bg-gradient-to-l to-transparent transition-opacity duration-300 sm:hidden',
            showRightIndicator ? 'opacity-100' : 'opacity-0',
          )}
        />

        <TabsList
          ref={scrollContainerRef}
          className={cn(
            'scrollbar-hide whitespace-nowrap',
            visibleItems.length < 3
              ? cn('grid w-full sm:w-max', getGridColsClass(visibleItems.length))
              : cn(
                  'flex w-full justify-start overflow-x-auto sm:grid sm:inline-flex sm:w-auto',
                  getGridColsClass(visibleItems.length),
                ),
            tabsListClassName,
          )}
        >
          {visibleItems.map((item) => (
            <TabsTrigger
              key={item.value}
              value={item.value}
              className={cn('gap-2 shrink-0 transition-transform active:scale-95', visibleItems.length >= 3 && 'min-w-[120px] sm:min-w-0')}
              disabled={isPending || item.disabled}
            >
              {item.label}
              {item.icon && <span className="hidden sm:inline-block">{item.icon}</span>}
              {item.badge}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {children}
    </Tabs>
  );
};
