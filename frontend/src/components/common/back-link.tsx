'use client';

import React from 'react';
import { Link } from '@/i18n/routing';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BackLinkProps {
  href: string;
  label?: string;
  className?: string;
}

export function BackLink({ href, label, className }: BackLinkProps) {
  return (
    <div className={cn('flex items-center justify-start', className)}>
      <Link
        href={href as any}
        className="group rounded-app hover:bg-warning hover:border-warning flex items-center gap-4 border border-white/10 bg-white/5 py-2.5 pr-6 pl-2 shadow-xl backdrop-blur-md transition-all duration-300"
      >
        <ArrowLeft className="h-4 w-4 text-white/80 transition-transform group-hover:-translate-x-1 group-hover:text-black" />
        <span className="text-[11px] font-black tracking-[0.2em] text-white/80 uppercase transition-colors group-hover:text-black">
          {label || 'Späť'}
        </span>
      </Link>
    </div>
  );
}
