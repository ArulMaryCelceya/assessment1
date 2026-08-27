import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';
import { TopProduct } from '../types';
import { formatCompactCurrency, formatCurrency } from '../utils/formatters';
import { Award } from 'lucide-react';

interface ProductChartProps {
  data: TopProduct[];
  loading?: boolean;
}

export const ProductChart: React.FC<ProductChartProps> = ({ data, loading = false }) => {
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
      const item = payload[0].payload as TopProduct;
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl text-xs space-y-1">
          <p className="font-bold text-slate-200">{item.item}</p>
          <p className="text-[11px] text-slate-400 font-medium">Group: {item.group}</p>
          <div className="flex justify-between gap-4 text-amber-400 font-mono">
            <span>Revenue:</span>
            <span className="font-bold">{formatCurrency(item.revenue)}</span>
          </div>
          <div className="flex justify-between gap-4 text-slate-400 font-mono">
            <span>Units Sold:</span>
            <span>{item.quantity.toLocaleString()}</span>
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
          <Award className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide">
            Top Performing Products
          </h3>
        </div>
        <span className="text-xs text-slate-400 font-medium">Top 10 by Revenue</span>
      </div>

      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 15, left: 40, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
            <XAxis 
              type="number" 
              stroke="#64748b" 
              fontSize={10} 
              tickLine={false}
              tickFormatter={(val) => formatCompactCurrency(val)}
            />
            <YAxis 
              dataKey="item" 
              type="category" 
              stroke="#64748b" 
              fontSize={10} 
              tickLine={false}
              width={100}
              tickFormatter={(val) => val.length > 15 ? `${val.substring(0, 15)}...` : val}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="revenue" fill="#f59e0b" radius={[0, 4, 4, 0]}>
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={index < 3 ? '#f59e0b' : '#3b82f6'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
