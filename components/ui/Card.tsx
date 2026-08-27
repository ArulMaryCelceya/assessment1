import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div
      className={`bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg backdrop-blur-md transition-all duration-200 hover:border-slate-700/80 ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }: CardProps) {
  return <div className={`flex flex-col gap-1 mb-4 ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = '' }: CardProps) {
  return <h3 className={`text-base font-semibold text-slate-100 flex items-center gap-2 ${className}`}>{children}</h3>;
}

export function CardDescription({ children, className = '' }: CardProps) {
  return <p className={`text-xs text-slate-400 font-normal ${className}`}>{children}</p>;
}
