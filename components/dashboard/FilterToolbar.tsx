import React, { useState } from 'react';
import { FilterState, SummaryMetrics } from '../../types/analytics';
import { Filter, RotateCcw, Search, Calendar, Store, Tag, ShoppingBag, CreditCard } from 'lucide-react';

interface FilterToolbarProps {
  summary: SummaryMetrics;
  filters: FilterState;
  onApplyFilters: (filters: FilterState) => void;
  onResetFilters: () => void;
}

export function FilterToolbar({ summary, filters, onApplyFilters, onResetFilters }: FilterToolbarProps) {
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleOutletToggle = (outlet: string) => {
    const current = localFilters.outlets;
    const updated = current.includes(outlet)
      ? current.filter((o) => o !== outlet)
      : [...current, outlet];
    setLocalFilters({ ...localFilters, outlets: updated });
  };

  const handleCategoryToggle = (cat: string) => {
    const current = localFilters.categories;
    const updated = current.includes(cat) ? current.filter((c) => c !== cat) : [...current, cat];
    setLocalFilters({ ...localFilters, categories: updated });
  };

  const handleOrderTypeToggle = (ot: string) => {
    const current = localFilters.orderTypes;
    const updated = current.includes(ot) ? current.filter((o) => o !== ot) : [...current, ot];
    setLocalFilters({ ...localFilters, orderTypes: updated });
  };

  const handleSettlementToggle = (settlement: string) => {
    const current = localFilters.settlements;
    const updated = current.includes(settlement)
      ? current.filter((s) => s !== settlement)
      : [...current, settlement];
    setLocalFilters({ ...localFilters, settlements: updated });
  };

  const handleApply = () => {
    onApplyFilters(localFilters);
  };

  const handleReset = () => {
    const resetState: FilterState = {
      startDate: '',
      endDate: '',
      outlets: [],
      brands: [],
      categories: [],
      orderTypes: [],
      settlements: [],
      searchTerm: '',
    };
    setLocalFilters(resetState);
    onResetFilters();
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg mb-6 backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Filter className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-200">Global Analytics Filters</h2>
            <p className="text-xs text-slate-400">Filter dataset metrics dynamically</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs font-medium text-indigo-400 hover:text-indigo-300 px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 md:hidden"
          >
            {isExpanded ? 'Hide Filters' : 'Show All Filters'}
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
          <button
            onClick={handleApply}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all"
          >
            Apply Filters
          </button>
        </div>
      </div>

      {/* Filter Options Grid */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${isExpanded ? 'block' : 'hidden md:grid'}`}>
        {/* Date Range Filter */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-indigo-400" />
            Date Range
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="date"
              min={summary.dateRange.min}
              max={summary.dateRange.max}
              value={localFilters.startDate}
              onChange={(e) => setLocalFilters({ ...localFilters, startDate: e.target.value })}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
            <input
              type="date"
              min={summary.dateRange.min}
              max={summary.dateRange.max}
              value={localFilters.endDate}
              onChange={(e) => setLocalFilters({ ...localFilters, endDate: e.target.value })}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Outlet Filter */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
            <Store className="w-3.5 h-3.5 text-cyan-400" />
            Outlet
          </label>
          <select
            value={localFilters.outlets[0] || ''}
            onChange={(e) =>
              setLocalFilters({
                ...localFilters,
                outlets: e.target.value ? [e.target.value] : [],
              })
            }
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="">All Outlets ({summary.outlets.length})</option>
            {summary.outlets.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-purple-400" />
            Category (Group)
          </label>
          <select
            value={localFilters.categories[0] || ''}
            onChange={(e) =>
              setLocalFilters({
                ...localFilters,
                categories: e.target.value ? [e.target.value] : [],
              })
            }
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="">All Categories ({summary.categories.length})</option>
            {summary.categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Order Type & Settlement Filter */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
            <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
            Order Type & Payment
          </label>
          <div className="grid grid-cols-2 gap-2">
            <select
              value={localFilters.orderTypes[0] || ''}
              onChange={(e) =>
                setLocalFilters({
                  ...localFilters,
                  orderTypes: e.target.value ? [e.target.value] : [],
                })
              }
              className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="">Order Type</option>
              {summary.orderTypes.map((ot) => (
                <option key={ot} value={ot}>
                  {ot}
                </option>
              ))}
            </select>
            <select
              value={localFilters.settlements[0] || ''}
              onChange={(e) =>
                setLocalFilters({
                  ...localFilters,
                  settlements: e.target.value ? [e.target.value] : [],
                })
              }
              className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="">Settlement</option>
              {summary.settlements.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
