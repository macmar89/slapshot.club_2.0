import * as Label from '@radix-ui/react-label';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchInput({ value, onChange, placeholder, className }: SearchInputProps) {
  const [localValue, setLocalValue] = useState(value);
  const [prevPropValue, setPrevPropValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);

  // Sync local state with external value if it changes, but only if not focused.
  // This prevents cursor jumping when tied to a debounced URL state.
  // Using render-phase state update avoids cascading renders from useEffect.
  if (value !== prevPropValue) {
    setPrevPropValue(value);
    if (!isFocused) {
      setLocalValue(value);
    }
  }

  const handleChange = (newValue: string) => {
    setLocalValue(newValue);
    onChange(newValue);
  };

  return (
    <div className={cn('relative w-full md:w-64', className)}>
      <Label.Root htmlFor="main-search" className="sr-only">
        {placeholder}
      </Label.Root>

      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <Search className="h-3.5 w-3.5 text-white/40" />
      </div>

      <input
        id="main-search"
        type="text"
        value={localValue}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={() => {
          setIsFocused(true);
        }}
        onBlur={() => {
          setIsFocused(false);
        }}
        placeholder={placeholder}
        className={cn(
          'rounded-app block w-full border border-white/10 bg-white/5 py-2 pr-9 pl-9 leading-5 font-medium text-white placeholder-white/20 transition-all',
          'focus:border-warning/50 focus:ring-warning/50 focus:bg-white/10 focus:ring-1 focus:outline-none sm:text-xs',
          localValue.length > 0 && localValue.length < 3 ? 'border-warning/30' : 'border-white/10',
        )}
      />

      {localValue.length > 0 && (
        <button
          onClick={() => handleChange('')}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-white/20 hover:text-white"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}
