import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { OrderTypeDistribution } from '../types';
import { formatCurrency } from '../utils/formatters';
import { ShoppingBag } from 'lucide-react';

interface OrderTypeChartProps {
  data: OrderTypeDistribution[];
  loading?: boolean;
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6'];

export const OrderTypeChart: React.FC<OrderTypeChartProps> = ({ data, loading = false }) => {
  if (loading) {
    return (
      <div className="glass-card p-5 h-80 flex flex-col justify-between animate-pulse">
        <div className="h-5 w-40 bg-slate-800 rounded" />
        <div className="h-56 bg-slate-800/40 rounded-full w-48 mx-auto" />
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload as OrderTypeDistribution;
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl text-xs space-y-1">
          <p className="font-bold text-slate-200">{item.order_type}</p>
          <div className="flex justify-between gap-4 text-emerald-400 font-mono">
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
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide">
            Order Type Distribution
          </h3>
        </div>
        <span className="text-xs text-slate-400 font-medium">Fulfillment Channels</span>
      </div>

      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="45%"
              outerRadius={75}
              dataKey="revenue"
              nameKey="order_type"
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              labelLine={false}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom" 
              height={36} 
              iconType="circle"
              wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
