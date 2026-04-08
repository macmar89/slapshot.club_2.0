import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Megaphone, Info, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnnouncementType } from '../../admin/announcements/announcements.types';

export const typeConfig = {
  INFO: {
    icon: Info,
    className: 'text-blue-400 border-blue-400/20 bg-blue-400/10',
    label: 'INFO',
  },
  UPDATE: {
    icon: Zap,
    className: 'text-yellow-400 border-yellow-400/20 bg-yellow-400/10',
    label: 'UPGRADE',
  },
  FEATURE: {
    icon: Megaphone,
    className: 'text-purple-400 border-purple-400/20 bg-purple-400/10',
    label: 'FEATURE',
  },
} as const;

interface AnnouncementTypeBadgeProps {
  type: AnnouncementType;
  className?: string;
}

export function AnnouncementTypeBadge({ type, className }: AnnouncementTypeBadgeProps) {
  const config = typeConfig[type as keyof typeof typeConfig] || typeConfig.INFO;
  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={cn(
        'flex items-center gap-2 border-0 bg-white/5 px-3 py-1.5 text-[10px] font-black tracking-widest uppercase italic',
        config.className,
        className
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </Badge>
  );
}
