import React from 'react';
import { Menu, Filter, RefreshCw, Layers } from 'lucide-react';
import { FilterState } from '../../types/analytics';

interface HeaderProps {
  onToggleSidebar: () => void;
  filters: FilterState;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export function Header({ onToggleSidebar, filters, onRefresh, isRefreshing }: HeaderProps) {
  const activeFilterCount =
    (filters.outlets.length > 0 ? 1 : 0) +
    (filters.brands.length > 0 ? 1 : 0) +
    (filters.categories.length > 0 ? 1 : 0) +
    (filters.orderTypes.length > 0 ? 1 : 0) +
    (filters.settlements.length > 0 ? 1 : 0) +
    (filters.startDate ? 1 : 0) +
    (filters.endDate ? 1 : 0) +
    (filters.searchTerm ? 1 : 0);

  return (
    <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-4 lg:px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 rounded-lg lg:hidden transition-colors"
          aria-label="Toggle sidebar menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
            Business Analytics Dashboard
          </h1>
          <p className="text-xs text-slate-400 font-medium hidden sm:block">
            Restaurant Sales & Performance Intelligence
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Active Filter Counter Pill */}
        {activeFilterCount > 0 ? (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold">
            <Filter className="w-3.5 h-3.5" />
            <span>{activeFilterCount} Filter{activeFilterCount > 1 ? 's' : ''} Active</span>
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 text-xs font-medium">
            <Layers className="w-3.5 h-3.5 text-slate-500" />
            <span>All Data (Unfiltered)</span>
          </div>
        )}

        {/* Refresh Button */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-medium transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-indigo-400' : ''}`} />
          <span className="hidden sm:inline">Refresh Data</span>
        </button>
      </div>
    </header>
  );
}
