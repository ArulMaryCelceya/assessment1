import React, { useState } from 'react';
import { ItemMetric } from '../../types/analytics';
import { formatCurrency, formatNumber } from '../../lib/utils/formatters';
import { Card, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Utensils } from 'lucide-react';
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

interface TopItemsChartProps {
  data: ItemMetric[];
}

export function TopItemsChart({ data }: TopItemsChartProps) {
  const [limit, setLimit] = useState<number>(10);

  const displayData = React.useMemo(() => {
    return data.slice(0, limit);
  }, [data, limit]);

  if (!displayData || displayData.length === 0) {
    return (
      <Card className="h-80 flex flex-col items-center justify-center text-center p-6">
        <Utensils className="w-8 h-8 text-slate-600 mb-2" />
        <p className="text-sm font-semibold text-slate-300">No Item Data</p>
      </Card>
    );
  }

  return (
    <Card className="h-[460px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>
            <Utensils className="w-5 h-5 text-amber-400" />
            Top Performing Items
          </CardTitle>
          <CardDescription>Menu items ranked by total revenue contribution</CardDescription>
        </div>

        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setLimit(10)}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
              limit === 10
                ? 'bg-amber-600 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Top 10
          </button>
          <button
            onClick={() => setLimit(20)}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
              limit === 20
                ? 'bg-amber-600 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Top 20
          </button>
          <button
            onClick={() => setLimit(50)}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
              limit === 50
                ? 'bg-amber-600 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Top 50
          </button>
        </div>
      </CardHeader>

      <div className="flex-1 w-full min-h-0 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={displayData}
            margin={{ top: 5, right: 20, left: 90, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
            <XAxis
              type="number"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
              tickFormatter={(value) => formatCurrency(value, true)}
            />
            <YAxis
              type="category"
              dataKey="item"
              stroke="#cbd5e1"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
              width={100}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#334155',
                borderRadius: '8px',
                color: '#f8fafc',
                fontSize: '12px',
              }}
              formatter={(value: any, name: any, item: any) => [
                `${formatCurrency(Number(value))} (${formatNumber(item.payload.quantity)} units)`,
                'Revenue',
              ]}
              labelFormatter={(label) => `Item: ${label}`}
            />
            <Bar dataKey="revenue" fill="#f59e0b" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
