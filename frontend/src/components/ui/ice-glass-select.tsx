'use client';

import * as React from 'react';
import { ChevronDown, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

export interface SelectOption {
  value: string;
  label: string;
  isActive?: boolean;
}

interface IceGlassSelectProps {
  options: SelectOption[];
  value?: string;
  placeholder?: string;
  onChange: (value: string | undefined) => void;
  className?: string;
  label?: string;
  disabled?: boolean;
}

export function IceGlassSelect({
  options,
  value,
  placeholder = 'Select...',
  onChange,
  className,
  label,
  disabled
}: IceGlassSelectProps) {
  const [open, setOpen] = React.useState(false);
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && (
        <span className="text-[10px] font-black uppercase tracking-widest text-white/50 px-1">
          {label}
        </span>
      )}
      
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn(
              "w-full justify-between bg-white/5 border border-white/10 rounded-xl h-12 px-4 text-white hover:bg-white/10 hover:border-white/20 transition-all",
              !value && "text-white/30",
              open && "border-primary/40 ring-1 ring-primary/20 bg-white/10"
            )}
          >
            <span className="truncate">
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            <ChevronDown className={cn("ml-2 h-4 w-4 shrink-0 opacity-50 transition-transform duration-300", open && "rotate-180 opacity-100 text-primary")} />
          </Button>
        </PopoverTrigger>
        
        <PopoverContent 
          className="w-[--radix-popover-trigger-width] p-0 border-white/10 bg-slate-950/90 backdrop-blur-2xl rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
          align="start"
        >
          {/* Top Shine */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
          
          <div className="relative py-1.5 max-h-[300px] overflow-y-auto custom-scrollbar">
            {options.length === 0 ? (
              <div className="px-4 py-8 text-center text-xs font-bold uppercase tracking-widest text-white/20 italic">
                Žiadne možnosti
              </div>
            ) : (
              options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onChange(option.value === value ? undefined : option.value);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between px-4 py-3 text-sm transition-all duration-200 group hover:bg-white/10",
                    value === option.value ? "text-primary bg-primary/5" : "text-white/60 hover:text-white",
                    option.isActive === false && "opacity-40"
                  )}
                >
                  <span className="text-xs font-bold tracking-tight uppercase">
                    {option.label}
                    {option.isActive === false && <span className="ml-2 lowercase opacity-50">(neaktívna)</span>}
                  </span>
                  
                  {value === option.value && (
                    <div className="border-primary/20 bg-primary/10 flex h-4 w-4 items-center justify-center rounded-full border shadow-[0_0_10px_rgba(234,179,8,0.3)]">
                      <Check className="text-primary h-2.5 w-2.5 stroke-[3px]" />
                    </div>
                  )}
                </button>
              ))
            )}
          </div>
          
          {/* Clear button if value exists */}
          {value && (
            <div className="border-t border-white/5 p-1">
              <button
                onClick={() => {
                  onChange(undefined);
                  setOpen(false);
                }}
                className="flex w-full items-center justify-center gap-2 rounded-xl py-2 text-[10px] font-black uppercase tracking-widest text-white/20 hover:bg-white/5 hover:text-white/60 transition-all"
              >
                <X className="h-3 w-3" />
                Zrušiť výber
              </button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}
