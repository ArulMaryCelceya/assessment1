import React from 'react';
import { FilterState } from '../../types/analytics';
import { X } from 'lucide-react';

interface ActiveFilterChipsProps {
  filters: FilterState;
  onRemoveFilter: (key: keyof FilterState, value?: string) => void;
  onClearAll: () => void;
}

export function ActiveFilterChips({ filters, onRemoveFilter, onClearAll }: ActiveFilterChipsProps) {
  const chips: { label: string; key: keyof FilterState; value?: string }[] = [];

  if (filters.startDate) {
    chips.push({ label: `From: ${filters.startDate}`, key: 'startDate' });
  }
  if (filters.endDate) {
    chips.push({ label: `To: ${filters.endDate}`, key: 'endDate' });
  }
  filters.outlets.forEach((o) => chips.push({ label: `Outlet: ${o}`, key: 'outlets', value: o }));
  filters.brands.forEach((b) => chips.push({ label: `Brand: ${b}`, key: 'brands', value: b }));
  filters.categories.forEach((c) => chips.push({ label: `Category: ${c}`, key: 'categories', value: c }));
  filters.orderTypes.forEach((ot) => chips.push({ label: `Type: ${ot}`, key: 'orderTypes', value: ot }));
  filters.settlements.forEach((s) => chips.push({ label: `Pay: ${s}`, key: 'settlements', value: s }));
  if (filters.searchTerm) {
    chips.push({ label: `Search: "${filters.searchTerm}"`, key: 'searchTerm' });
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      <span className="text-xs font-semibold text-slate-400">Active Filters:</span>
      {chips.map((chip, idx) => (
        <span
          key={idx}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-medium"
        >
          {chip.label}
          <button
            onClick={() => onRemoveFilter(chip.key, chip.value)}
            className="hover:text-white p-0.5 rounded transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}
      <button
        onClick={onClearAll}
        className="text-xs text-slate-400 hover:text-indigo-400 underline ml-2 font-medium"
      >
        Clear All
      </button>
    </div>
  );
}
