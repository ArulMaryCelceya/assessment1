import React from 'react';
import { SettlementMetric } from '../../types/analytics';
import { formatCurrency, formatPercent } from '../../lib/utils/formatters';
import { Card, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { CreditCard } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';

interface SettlementChartProps {
  data: SettlementMetric[];
}

const COLORS = ['#3b82f6', '#ec4899', '#8b5cf6', '#10b981'];

export function SettlementChart({ data }: SettlementChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card className="h-80 flex flex-col items-center justify-center text-center p-6">
        <CreditCard className="w-8 h-8 text-slate-600 mb-2" />
        <p className="text-sm font-semibold text-slate-300">No Settlement Data</p>
      </Card>
    );
  }

  return (
    <Card className="h-[350px] flex flex-col">
      <CardHeader>
        <CardTitle>
          <CreditCard className="w-5 h-5 text-blue-400" />
          Revenue by Settlement
        </CardTitle>
        <CardDescription>Payment channel contribution & settlement methods</CardDescription>
      </CardHeader>

      <div className="flex-1 w-full min-h-0 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis
              dataKey="settlement"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
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
              formatter={(value: any, name: any, item: any) => [
                `${formatCurrency(Number(value))} (${formatPercent(item.payload.percentage)})`,
                'Revenue',
              ]}
              labelFormatter={(label) => `Settlement: ${label}`}
            />
            <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
