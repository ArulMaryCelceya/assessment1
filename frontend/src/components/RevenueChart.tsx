import React from 'react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  Tooltip, CartesianGrid 
} from 'recharts';
import { RevenueTrendPoint } from '../types';
import { formatCompactCurrency, formatCurrency } from '../utils/formatters';
import { TrendingUp } from 'lucide-react';

interface RevenueChartProps {
  data: RevenueTrendPoint[];
  loading?: boolean;
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ data, loading = false }) => {
  if (loading) {
    return (
      <div className="glass-card p-5 h-80 flex flex-col justify-between animate-pulse">
        <div className="h-5 w-40 bg-slate-800 rounded" />
        <div className="h-56 bg-slate-800/40 rounded w-full" />
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl text-xs">
          <p className="font-semibold text-slate-300 mb-1">{label}</p>
          <div className="flex items-center justify-between gap-4 text-blue-400 font-mono">
            <span>Revenue:</span>
            <span className="font-bold">{formatCurrency(payload[0].value)}</span>
          </div>
          {payload[0].payload.orders && (
            <div className="flex items-center justify-between gap-4 text-slate-400 font-mono mt-0.5">
              <span>Orders:</span>
              <span>{payload[0].payload.orders.toLocaleString()}</span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card p-5 h-80 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide">
            Revenue Trend Over Time
          </h3>
        </div>
        <span className="text-xs text-slate-400 font-medium">Daily Timeline</span>
      </div>

      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis 
              dataKey="date" 
              stroke="#64748b" 
              fontSize={11} 
              tickLine={false}
              axisLine={{ stroke: '#1e293b' }}
            />
            <YAxis 
              stroke="#64748b" 
              fontSize={11} 
              tickLine={false}
              axisLine={{ stroke: '#1e293b' }}
              tickFormatter={(val) => formatCompactCurrency(val)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke="#3b82f6" 
              strokeWidth={2.5}
              fillOpacity={1} 
              fill="url(#colorRevenue)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
