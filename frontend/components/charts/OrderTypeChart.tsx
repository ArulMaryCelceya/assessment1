import React from 'react';
import { OrderTypeMetric } from '../../types/analytics';
import { formatNumber, formatPercent } from '../../lib/utils/formatters';
import { Card, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { ShoppingBag } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

interface OrderTypeChartProps {
  data: OrderTypeMetric[];
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ec4899'];

export function OrderTypeChart({ data }: OrderTypeChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card className="h-80 flex flex-col items-center justify-center text-center p-6">
        <ShoppingBag className="w-8 h-8 text-slate-600 mb-2" />
        <p className="text-sm font-semibold text-slate-300">No Order Type Data</p>
      </Card>
    );
  }

  return (
    <Card className="h-[350px] flex flex-col">
      <CardHeader>
        <CardTitle>
          <ShoppingBag className="w-5 h-5 text-emerald-400" />
          Orders by Order Type
        </CardTitle>
        <CardDescription>Dine-In vs Takeaway vs Delivery breakdown</CardDescription>
      </CardHeader>

      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="48%"
              innerRadius={50}
              outerRadius={85}
              paddingAngle={4}
              dataKey="orders"
              nameKey="orderType"
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
                `${formatNumber(Number(value))} Orders (${formatPercent(item.payload.percentage)})`,
                'Order Count',
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
