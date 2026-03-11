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

  const visibleItems = items.filter((item) => item.show !== false);
  const currentParamValue = searchParams.get(paramName);
  const activeTab = currentParamValue || defaultValue || visibleItems[0]?.value;

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
        params.set(paramName, value);
        // Use window.location.pathname if pathname isn't working as expected in dynamic routes
        const currentPath = window.location.pathname;
        router.replace(`${currentPath}?${params.toString()}`, { scroll: false });
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
      <div className="mb-4 px-1">
        <TabsList
          className={cn('grid w-full', getGridColsClass(visibleItems.length), tabsListClassName)}
        >
          {visibleItems.map((item) => (
            <TabsTrigger
              key={item.value}
              value={item.value}
              className="gap-2"
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
