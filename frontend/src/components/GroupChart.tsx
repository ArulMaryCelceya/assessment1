import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { GroupPerformance } from '../types';
import { formatCurrency } from '../utils/formatters';
import { FolderTree } from 'lucide-react';

interface GroupChartProps {
  data: GroupPerformance[];
  loading?: boolean;
}

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#6366f1', '#14b8a6'];

export const GroupChart: React.FC<GroupChartProps> = ({ data, loading = false }) => {
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
      const item = payload[0].payload as GroupPerformance;
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl text-xs space-y-1">
          <p className="font-bold text-slate-200">{item.group}</p>
          <div className="flex justify-between gap-4 text-blue-400 font-mono">
            <span>Revenue:</span>
            <span className="font-bold">{formatCurrency(item.revenue)}</span>
          </div>
          <div className="flex justify-between gap-4 text-emerald-400 font-mono">
            <span>Share:</span>
            <span className="font-bold">{item.percentage}%</span>
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
          <FolderTree className="w-4 h-4 text-violet-400" />
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide">
            Revenue by Product Group
          </h3>
        </div>
        <span className="text-xs text-slate-400 font-medium">Category Breakdown</span>
      </div>

      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="45%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={3}
              dataKey="revenue"
              nameKey="group"
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
