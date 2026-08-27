import React from 'react';
import { BusinessInsightsData } from '../../types/analytics';
import { formatCurrency, formatNumber } from '../../lib/utils/formatters';
import { Card, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import {
  Trophy,
  Crown,
  Flame,
  Truck,
  Calendar,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';

interface BusinessInsightsProps {
  insights: BusinessInsightsData;
}

export function BusinessInsights({ insights }: BusinessInsightsProps) {
  const cards = [
    {
      title: 'Top Revenue Outlet',
      value: insights.topOutlet.name,
      stat: formatCurrency(insights.topOutlet.revenue, true),
      subtext: `${insights.topOutlet.percentage}% of overall restaurant revenue`,
      icon: Trophy,
      color: 'from-amber-500/20 to-yellow-500/10 text-amber-400 border-amber-500/30',
    },
    {
      title: 'Top Category',
      value: insights.topCategory.name,
      stat: formatCurrency(insights.topCategory.revenue, true),
      subtext: `${insights.topCategory.percentage}% total menu sales contribution`,
      icon: Crown,
      color: 'from-purple-500/20 to-indigo-500/10 text-purple-400 border-purple-500/30',
    },
    {
      title: 'Best-Selling Item',
      value: insights.bestSellingItem.name,
      stat: formatCurrency(insights.bestSellingItem.revenue, true),
      subtext: `${formatNumber(insights.bestSellingItem.quantity)} units sold (${insights.bestSellingItem.category})`,
      icon: Flame,
      color: 'from-rose-500/20 to-orange-500/10 text-rose-400 border-rose-500/30',
    },
    {
      title: 'Most Used Order Type',
      value: insights.mostUsedOrderType.name,
      stat: `${insights.mostUsedOrderType.percentage}% Orders`,
      subtext: `${formatNumber(insights.mostUsedOrderType.orders)} completed orders`,
      icon: Truck,
      color: 'from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/30',
    },
    {
      title: 'Peak Revenue Period',
      value: insights.peakRevenuePeriod.date,
      stat: formatCurrency(insights.peakRevenuePeriod.revenue, true),
      subtext: `Single-day peak with ${formatNumber(insights.peakRevenuePeriod.orders)} orders`,
      icon: Calendar,
      color: 'from-cyan-500/20 to-blue-500/10 text-cyan-400 border-cyan-500/30',
    },
    {
      title: 'Calculated AOV',
      value: formatCurrency(insights.aov, false),
      stat: 'Average / Order',
      subtext: 'Revenue divided by unique bill transactions',
      icon: Sparkles,
      color: 'from-indigo-500/20 to-violet-500/10 text-indigo-400 border-indigo-500/30',
    },
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-indigo-400" />
        <h2 className="text-lg font-bold text-slate-100">Key Business Insights</h2>
        <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-semibold">
          Auto-Calculated
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Card key={idx} className="relative overflow-hidden group">
              <div className="flex items-start justify-between mb-3">
                <div
                  className={`w-9 h-9 rounded-lg bg-gradient-to-br border flex items-center justify-center ${card.color}`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors" />
              </div>
              <p className="text-xs font-medium text-slate-400">{card.title}</p>
              <h4 className="text-base font-bold text-slate-100 mt-0.5 truncate" title={card.value}>
                {card.value}
              </h4>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-sm font-bold text-indigo-400">{card.stat}</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 font-medium truncate">{card.subtext}</p>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
