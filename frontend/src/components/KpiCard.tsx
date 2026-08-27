import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  color?: 'blue' | 'indigo' | 'emerald' | 'amber' | 'violet' | 'rose';
  loading?: boolean;
}

const colorStyles = {
  blue: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    text: 'text-blue-400',
    iconBg: 'bg-blue-500/20 text-blue-400',
  },
  indigo: {
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/20',
    text: 'text-indigo-400',
    iconBg: 'bg-indigo-500/20 text-indigo-400',
  },
  emerald: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    text: 'text-emerald-400',
    iconBg: 'bg-emerald-500/20 text-emerald-400',
  },
  amber: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    text: 'text-amber-400',
    iconBg: 'bg-amber-500/20 text-amber-400',
  },
  violet: {
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/20',
    text: 'text-violet-400',
    iconBg: 'bg-violet-500/20 text-violet-400',
  },
  rose: {
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/20',
    text: 'text-rose-400',
    iconBg: 'bg-rose-500/20 text-rose-400',
  },
};

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'blue',
  loading = false,
}) => {
  const styles = colorStyles[color];

  if (loading) {
    return (
      <div className="glass-card p-5 animate-pulse flex flex-col justify-between h-32">
        <div className="flex justify-between items-center">
          <div className="h-4 w-24 bg-slate-800 rounded" />
          <div className="w-10 h-10 bg-slate-800 rounded-lg" />
        </div>
        <div className="h-7 w-32 bg-slate-800 rounded mt-2" />
        <div className="h-3 w-20 bg-slate-800/60 rounded" />
      </div>
    );
  }

  return (
    <div className={`glass-card p-5 flex flex-col justify-between relative overflow-hidden group border ${styles.border}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {title}
        </span>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${styles.iconBg} transition-transform group-hover:scale-110`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-3">
        <div className="text-2xl lg:text-3xl font-extrabold text-slate-100 tracking-tight font-mono">
          {value}
        </div>
        {subtitle && (
          <p className="text-xs text-slate-400 font-medium mt-1">
            {subtitle}
          </p>
        )}
      </div>

      {/* Decorative gradient blur */}
      <div className={`absolute -right-6 -bottom-6 w-24 h-24 rounded-full ${styles.bg} blur-2xl opacity-40 group-hover:opacity-70 transition-opacity`} />
    </div>
  );
};
