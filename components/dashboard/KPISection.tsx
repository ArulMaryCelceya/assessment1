import React from 'react';
import { SummaryMetrics } from '../../types/analytics';
import { formatCurrency, formatNumber } from '../../lib/utils/formatters';
import { Card } from '../ui/Card';
import {
  IndianRupee,
  ShoppingBag,
  Database,
  Layers,
  TrendingUp,
  Tag,
} from 'lucide-react';

interface KPISectionProps {
  summary: SummaryMetrics;
}

export function KPISection({ summary }: KPISectionProps) {
  const kpiList = [
    {
      id: 'total-revenue',
      title: 'Total Revenue',
      value: formatCurrency(summary.totalRevenue, true),
      fullValue: formatCurrency(summary.totalRevenue, false),
      description: 'Sum of (Price × Quantity)',
      icon: IndianRupee,
      color: 'from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/30',
    },
    {
      id: 'total-orders',
      title: 'Total Orders',
      value: formatNumber(summary.uniqueOrders),
      description: 'Count of unique BillNo orders',
      icon: ShoppingBag,
      color: 'from-indigo-500/20 to-blue-500/10 text-indigo-400 border-indigo-500/30',
    },
    {
      id: 'total-records',
      title: 'Total Records',
      value: formatNumber(summary.totalRows),
      description: 'Total line-item dataset rows',
      icon: Database,
      color: 'from-purple-500/20 to-pink-500/10 text-purple-400 border-purple-500/30',
    },
    {
      id: 'total-quantity',
      title: 'Total Quantity Sold',
      value: formatNumber(summary.totalQuantity),
      description: 'Sum of all items sold',
      icon: Layers,
      color: 'from-cyan-500/20 to-sky-500/10 text-cyan-400 border-cyan-500/30',
    },
    {
      id: 'aov',
      title: 'Average Order Value',
      value: formatCurrency(summary.aov, false),
      description: 'Total Revenue / Unique Orders',
      icon: TrendingUp,
      color: 'from-amber-500/20 to-orange-500/10 text-amber-400 border-amber-500/30',
    },
    {
      id: 'avg-item-price',
      title: 'Average Item Price',
      value: formatCurrency(summary.avgItemPrice, false),
      description: 'Average unit price per item',
      icon: Tag,
      color: 'from-rose-500/20 to-red-500/10 text-rose-400 border-rose-500/30',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {kpiList.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <Card key={kpi.id} className="relative overflow-hidden group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 tracking-wide">{kpi.title}</span>
              <div
                className={`w-9 h-9 rounded-lg bg-gradient-to-br border flex items-center justify-center ${kpi.color}`}
              >
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="mb-1">
              <span className="text-2xl font-bold text-slate-100 tracking-tight" title={kpi.fullValue || kpi.value}>
                {kpi.value}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium truncate">{kpi.description}</p>
          </Card>
        );
      })}
    </div>
  );
}
