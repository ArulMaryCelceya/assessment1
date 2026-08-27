import React, { useState } from 'react';
import { OutletMetric } from '../../types/analytics';
import { formatCurrency } from '../../lib/utils/formatters';
import { Card, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Store } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';

interface OutletPerformanceChartProps {
  data: OutletMetric[];
}

const BAR_COLORS = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

export function OutletPerformanceChart({ data }: OutletPerformanceChartProps) {
  const [topLimit, setTopLimit] = useState<number>(10);

  const displayData = React.useMemo(() => {
    return data.slice(0, topLimit);
  }, [data, topLimit]);

  if (!displayData || displayData.length === 0) {
    return (
      <Card className="h-80 flex flex-col items-center justify-center text-center p-6">
        <Store className="w-8 h-8 text-slate-600 mb-2" />
        <p className="text-sm font-semibold text-slate-300">No Outlet Performance Data</p>
      </Card>
    );
  }

  return (
    <Card className="h-[380px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>
            <Store className="w-5 h-5 text-cyan-400" />
            Revenue by Outlet
          </CardTitle>
          <CardDescription>Outlets ranked by total sales revenue</CardDescription>
        </div>

        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setTopLimit(10)}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
              topLimit === 10
                ? 'bg-cyan-600 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Top 10
          </button>
          <button
            onClick={() => setTopLimit(20)}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
              topLimit === 20
                ? 'bg-cyan-600 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Top 20
          </button>
        </div>
      </CardHeader>

      <div className="flex-1 w-full min-h-0 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={displayData} margin={{ top: 10, right: 10, left: 10, bottom: 25 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis
              dataKey="outlet"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
              angle={-20}
              textAnchor="end"
            />
            <YAxis
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
              tickFormatter={(value) => formatCurrency(value, true)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#334155',
                borderRadius: '8px',
                color: '#f8fafc',
                fontSize: '12px',
              }}
              formatter={(value: any) => [formatCurrency(Number(value)), 'Revenue']}
              labelFormatter={(label) => `Outlet: ${label}`}
            />
            <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
              {displayData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
