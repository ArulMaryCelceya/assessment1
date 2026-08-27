import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';
import { SettlementDistribution } from '../types';
import { formatCompactCurrency, formatCurrency } from '../utils/formatters';
import { CreditCard } from 'lucide-react';

interface SettlementChartProps {
  data: SettlementDistribution[];
  loading?: boolean;
}

const SETTLEMENT_COLORS = ['#ec4899', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#06b6d4'];

export const SettlementChart: React.FC<SettlementChartProps> = ({ data, loading = false }) => {
  if (loading) {
    return (
      <div className="glass-card p-5 h-80 flex flex-col justify-between animate-pulse">
        <div className="h-5 w-40 bg-slate-800 rounded" />
        <div className="h-56 bg-slate-800/40 rounded w-full" />
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload as SettlementDistribution;
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl text-xs space-y-1">
          <p className="font-bold text-slate-200">{item.settlement}</p>
          <div className="flex justify-between gap-4 text-rose-400 font-mono">
            <span>Revenue:</span>
            <span className="font-bold">{formatCurrency(item.revenue)}</span>
          </div>
          <div className="flex justify-between gap-4 text-slate-400 font-mono">
            <span>Orders:</span>
            <span>{item.orders.toLocaleString()}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card p-5 h-80 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-rose-400" />
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide">
            Settlement Method Distribution
          </h3>
        </div>
        <span className="text-xs text-slate-400 font-medium">Payment Modes</span>
      </div>

      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis 
              dataKey="settlement" 
              stroke="#64748b" 
              fontSize={10} 
              tickLine={false}
              interval={0}
            />
            <YAxis 
              stroke="#64748b" 
              fontSize={11} 
              tickLine={false}
              tickFormatter={(val) => formatCompactCurrency(val)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={SETTLEMENT_COLORS[index % SETTLEMENT_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
