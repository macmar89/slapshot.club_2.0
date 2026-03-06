'use client';

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  register: any;
  rightElement?: React.ReactNode; // For "Forgot password" link in Login
}

export function PasswordInput({
  label,
  error,
  hint,
  register,
  className,
  rightElement,
  ...props
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const toggleVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="space-y-2 text-left">
      <div className="flex items-center justify-between">
        <label
          htmlFor={props.id}
          className="ml-1 text-xs font-medium tracking-wider text-white/80 uppercase"
        >
          {label}
        </label>
        {rightElement}
      </div>

      <div className="group relative">
        <input
          {...props}
          {...register}
          type={showPassword ? 'text' : 'password'}
          className={cn(
            'rounded-app w-full px-4 py-3 pr-11 transition-all duration-200 outline-none',
            'border border-white/10 bg-white/5 text-white placeholder:text-white/30',
            'focus:border-white/30 focus:bg-white/10 focus:ring-1 focus:ring-white/30',
            'hover:border-white/20 hover:bg-white/10',
            props.disabled && 'cursor-not-allowed opacity-50',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
            className,
          )}
        />
        <button
          type="button"
          onClick={toggleVisibility}
          disabled={props.disabled}
          className="absolute top-1/2 right-3 -translate-y-1/2 p-1.5 text-white/30 transition-colors outline-none hover:text-white focus:text-white disabled:pointer-events-none"
          tabIndex={-1}
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>

      {error ? (
        <p className="ml-1 text-xs text-red-500">{error}</p>
      ) : hint ? (
        <p className="ml-1 text-[10px] leading-tight tracking-tight text-white/40 uppercase">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
