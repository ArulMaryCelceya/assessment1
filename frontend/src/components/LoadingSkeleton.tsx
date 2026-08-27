import React from 'react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Filters Skeleton */}
      <div className="glass-card p-5 h-36 bg-slate-900/60 rounded-xl" />

      {/* KPI Cards Skeleton Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="glass-card p-5 h-32 bg-slate-900/60 rounded-xl flex flex-col justify-between" />
        ))}
      </div>

      {/* Main Charts Skeleton Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-5 h-80 bg-slate-900/60 rounded-xl" />
        <div className="glass-card p-5 h-80 bg-slate-900/60 rounded-xl" />
      </div>
    </div>
  );
};
