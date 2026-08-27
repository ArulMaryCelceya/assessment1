import React from 'react';
import { CategoryMetric } from '../../types/analytics';
import { formatCurrency, formatPercent } from '../../lib/utils/formatters';
import { Card, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Tag } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

interface CategoryPerformanceChartProps {
  data: CategoryMetric[];
}

const COLORS = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#3b82f6'];

export function CategoryPerformanceChart({ data }: CategoryPerformanceChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card className="h-80 flex flex-col items-center justify-center text-center p-6">
        <Tag className="w-8 h-8 text-slate-600 mb-2" />
        <p className="text-sm font-semibold text-slate-300">No Category Data</p>
      </Card>
    );
  }

  return (
    <Card className="h-[380px] flex flex-col">
      <CardHeader>
        <CardTitle>
          <Tag className="w-5 h-5 text-purple-400" />
          Revenue by Category
        </CardTitle>
        <CardDescription>Menu group contribution & percentage breakdown</CardDescription>
      </CardHeader>

      <div className="flex-1 w-full min-h-0 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="48%"
              innerRadius={55}
              outerRadius={95}
              paddingAngle={3}
              dataKey="revenue"
              nameKey="category"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#334155',
                borderRadius: '8px',
                color: '#f8fafc',
                fontSize: '12px',
              }}
              formatter={(value: any, name: any, item: any) => [
                `${formatCurrency(Number(value))} (${formatPercent(item.payload.percentage)})`,
                'Revenue',
              ]}
            />
            <Legend
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{ fontSize: '11px', color: '#94a3b8', paddingTop: '10px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
