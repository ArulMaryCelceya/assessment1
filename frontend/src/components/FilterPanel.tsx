import React, { useState, useEffect } from 'react';
import { Filter, RotateCcw, Check, Calendar, Store, Tag, FolderTree, ShoppingBag, CreditCard } from 'lucide-react';
import { AnalyticsFilters, FilterOptions } from '../types';

interface FilterPanelProps {
  options: FilterOptions | null;
  currentFilters: AnalyticsFilters;
  onApplyFilters: (filters: AnalyticsFilters) => void;
  onResetFilters: () => void;
  loading?: boolean;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  options,
  currentFilters,
  onApplyFilters,
  onResetFilters,
  loading = false,
}) => {
  const [localFilters, setLocalFilters] = useState<AnalyticsFilters>(currentFilters);

  useEffect(() => {
    setLocalFilters(currentFilters);
  }, [currentFilters]);

  const handleChange = (key: keyof AnalyticsFilters, value: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    onApplyFilters(localFilters);
  };

  const handleReset = () => {
    onResetFilters();
  };

  const isFiltered = Object.values(currentFilters).some(
    (val) => val && val !== 'all' && val !== ''
  );

  return (
    <div className="glass-card p-5 border border-slate-800">
      <div className="flex items-center justify-between mb-4 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-bold text-slate-200 tracking-wide uppercase">
            Interactive Filters
          </h3>
        </div>
        {isFiltered && (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            Active Filters Applied
          </span>
        )}
      </div>

      <form onSubmit={handleApply} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Start Date */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" /> Start Date
          </label>
          <input
            type="date"
            min={options?.min_date}
            max={options?.max_date}
            value={localFilters.start_date || ''}
            onChange={(e) => handleChange('start_date', e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* End Date */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" /> End Date
          </label>
          <input
            type="date"
            min={options?.min_date}
            max={options?.max_date}
            value={localFilters.end_date || ''}
            onChange={(e) => handleChange('end_date', e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Outlet Dropdown */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
            <Store className="w-3.5 h-3.5 text-slate-400" /> Outlet
          </label>
          <select
            value={localFilters.outlet || 'all'}
            onChange={(e) => handleChange('outlet', e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Outlets</option>
            {options?.outlets.map((out) => (
              <option key={out} value={out}>{out}</option>
            ))}
          </select>
        </div>

        {/* Brand Dropdown */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-slate-400" /> Brand
          </label>
          <select
            value={localFilters.brand || 'all'}
            onChange={(e) => handleChange('brand', e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Brands</option>
            {options?.brands.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>

        {/* Group / Category */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
            <FolderTree className="w-3.5 h-3.5 text-slate-400" /> Category / Group
          </label>
          <select
            value={localFilters.group || 'all'}
            onChange={(e) => handleChange('group', e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Groups</option>
            {options?.groups.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        {/* Order Type */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
            <ShoppingBag className="w-3.5 h-3.5 text-slate-400" /> Order Type
          </label>
          <select
            value={localFilters.order_type || 'all'}
            onChange={(e) => handleChange('order_type', e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Types</option>
            {options?.order_types.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Settlement & Action Buttons */}
        <div className="sm:col-span-2 lg:col-span-6 flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-800/80">
          <div className="w-full sm:w-64">
            <label className="block text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-slate-400" /> Settlement Method
            </label>
            <select
              value={localFilters.settlement || 'all'}
              onChange={(e) => handleChange('settlement', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Settlement Methods</option>
              {options?.settlements.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3 self-end">
            <button
              type="button"
              onClick={handleReset}
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              Reset Filters
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-md shadow-blue-600/20 disabled:opacity-50"
            >
              <Check className="w-3.5 h-3.5" />
              Apply Filters
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
