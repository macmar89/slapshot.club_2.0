'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

const TabsContext = React.createContext<{
  value: string;
  onValueChange: (value: string) => void;
} | null>(null);

const Tabs = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    defaultValue?: string;
    value?: string;
    onValueChange?: (value: string) => void;
  }
>(({ className, defaultValue, value: controlledValue, onValueChange, ...props }, ref) => {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue || '');
  const value = controlledValue !== undefined ? controlledValue : uncontrolledValue;

  const handleValueChange = React.useCallback(
    (newValue: string) => {
      setUncontrolledValue(newValue);
      if (onValueChange) {
        onValueChange(newValue);
      }
    },
    [onValueChange],
  );

  const contextValue = React.useMemo(
    () => ({ value, onValueChange: handleValueChange }),
    [value, handleValueChange],
  );

  return (
    <TabsContext.Provider value={contextValue}>
      <div ref={ref} className={cn('', className)} {...props} />
    </TabsContext.Provider>
  );
});
Tabs.displayName = 'Tabs';

const TabsList = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-app flex h-auto w-full items-center justify-start border border-white/10 bg-white/5 p-1 text-white/40 backdrop-blur-lg sm:inline-flex sm:w-auto',
        className,
      )}
      {...props}
    />
  ),
);
TabsList.displayName = 'TabsList';

const TabsTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string }
>(({ className, value, onClick, ...props }, ref) => {
  const context = React.useContext(TabsContext);
  if (!context) throw new Error('TabsTrigger must be used within Tabs');

  const isActive = context.value === value;

  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        'focus-visible:ring-ring inline-flex cursor-pointer items-center justify-center truncate px-1 py-2 text-[10px] font-black tracking-wider whitespace-nowrap uppercase transition-all hover:text-white focus-visible:ring-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 sm:px-4 sm:py-2.5 sm:text-xs sm:tracking-widest md:text-xs',
        isActive
          ? 'bg-warning shadow-warning/20 text-black shadow-lg'
          : 'text-white/50 hover:bg-white/5',
        className,
      )}
      onClick={(e) => {
        context.onValueChange(value);
        onClick?.(e);
      }}
      data-state={isActive ? 'active' : 'inactive'}
      {...props}
    />
  );
});
TabsTrigger.displayName = 'TabsTrigger';

const TabsContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value: string }
>(({ className, value, ...props }, ref) => {
  const context = React.useContext(TabsContext);
  if (!context) throw new Error('TabsContent must be used within Tabs');

  const isSelected = context.value === value;

  return (
    <div
      ref={ref}
      hidden={!isSelected}
      className={cn(
        'ring-offset-background focus-visible:ring-ring mt-2 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
        !isSelected && 'hidden',
        className,
      )}
      {...props}
    />
  );
});
TabsContent.displayName = 'TabsContent';

export { Tabs, TabsList, TabsTrigger, TabsContent };
