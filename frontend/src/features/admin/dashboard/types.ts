import { type LucideIcon } from 'lucide-react';

export interface DashboardStats {
  users: {
    total: number;
    unverified: number;
    inactive1w: number;
    inactive2w: number;
    inactive1m: number;
    roles: Record<string, number>;
    plans: Record<string, number>;
  };
  matches: {
    unverified72h: number;
    unrankedFinished: number;
  };
}

export interface StatItemProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color?: 'primary' | 'red' | 'amber' | 'orange' | 'emerald';
}

export interface DashboardCardProps {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
}
